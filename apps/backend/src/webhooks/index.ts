// TODO: remove this my manging the function in the index.ts
import dotenv from "dotenv";
dotenv.config();
import { createNodeMiddleware } from "@octokit/webhooks";
import fs from "fs";
import path from "path";
import { App } from "@octokit/app";
import jwt from "jsonwebtoken";
import { db } from "../lib/db.js";

import { giveBounty } from "./giveBounty.js";
import { newBounty } from "./newBounty.js";

const privateKeyPath = path.resolve(process.env.PRIVATE_KEY_PATH ?? "");
const octokitApp = new App({
  appId: process.env.APP_ID ?? "",
  privateKey: fs.readFileSync(privateKeyPath, "utf8"),
  webhooks: { secret: process.env.WEBHOOK_SECRET ?? "" },
});

const webhookMiddleware = createNodeMiddleware(octokitApp.webhooks, {
  path: "/api/webhook",
});

const privateKey = fs.readFileSync(privateKeyPath, "utf8");
const payload = {
  iat: Math.floor(Date.now() / 1000), // Issued at time
  exp: Math.floor(Date.now() / 1000) + 10 * 60, // JWT expiration time (10 minutes maximum)
  iss: process.env.APP_ID ?? "",
};

// return new access token each time
export const ACCESS_TOKEN = (): string =>
  jwt.sign(payload, privateKey, {
    algorithm: "RS256",
  });

// Tasks I have to hanle
// 1. create a new task contain /bounty $5
// 2. somebody create a pull request in which comment /give-bounty $5 @username
// 3. catch every comment on the issue or the pull request
octokitApp.webhooks.on("installation.created", async (context) => {
  try {
    const username = context.payload.sender.login;
    const reponamesArray = context.payload.repositories;

    reponamesArray?.forEach(async (repo) => {
      const reponame = repo.name;
      if (!reponame || !username) return;

      const isRepo = await db.repo.findUnique({
        where: {
          reponame: username + "/" + reponame,
        },
      });
      if (isRepo) return;
      const organization = await db.organization.findUnique({
        where: {
          name: username,
        },
      });
      if (!organization) return;
      await db.repo.create({
        data: {
          reponame: username + "/" + reponame,
          link: `https://github.com/${username}/${reponame}`,
          organizationId: organization.id,
          totalIssues: 0,
        },
      });
    });
  } catch (e) {}
});
octokitApp.webhooks.on("installation_repositories.added", async (context) => {
  try {
    const username = context.payload.sender.login;
    const reponamesArray = context.payload.repositories_added;

    reponamesArray?.forEach(async (repo) => {
      const reponame = repo.name;
      if (!reponame || !username) return;

      const isRepo = await db.repo.findUnique({
        where: {
          reponame: username + "/" + reponame,
        },
      });
      if (isRepo) return;
      const organization = await db.organization.findUnique({
        where: {
          name: username,
        },
      });
      if (!organization) return;
      await db.repo.create({
        data: {
          reponame: username + "/" + reponame,
          link: `https://github.com/${username}/${reponame}`,
          organizationId: organization.id,
          totalIssues: 0,
        },
      });
    });
  } catch (e) {}
});

// octokitApp.webhooks.on("pull_request.reopened", () => console.log(`first`));
// octokitApp.webhooks.on("pull_request.reopened", () => console.log(`first`));
octokitApp.webhooks.on("issues.opened", (context) => {
  const reponame = context.payload.repository.full_name;
  const username = context.payload.issue.user?.login;
  const issueUrl = context.payload.issue.html_url;
  const body = context.payload.issue.body || "";
  if (!username || username === `gitsolapp[bot]`) return;

  processEvent({
    reponame,
    username,
    body,
    issueUrl,
    payload: context.payload,
    octokit: context.octokit,
  });
});
octokitApp.webhooks.on("pull_request_review.submitted", (context) => {
  // console.log(context.payload.);
});

octokitApp.webhooks.on("issue_comment.created", (context) => {
  const reponame = context.payload.repository.full_name;
  const username = context.payload.comment.user?.login;
  const issueUrl = context.payload.issue.html_url;
  const body = context.payload.comment.body;
  if (!username || username === `gitsolapp[bot]`) return;

  processEvent({
    reponame,
    username,
    body,
    issueUrl,
    payload: context.payload,
    octokit: context.octokit,
  });
});

// !! set typesafety for the payload and octokit
async function processEvent({
  issueUrl,
  reponame,
  username,
  body,
  payload,
  octokit,
}: {
  issueUrl: string;
  reponame: string;
  username: string;
  body: string;
  payload: any;
  octokit: any;
}) {
  try {
    const isGiveBounty = body.match(
      /\/give-bounty \$(\d+(?:\.\d{1,2})?) @([a-zA-Z\d](?:[a-zA-Z\d-]{0,38}[a-zA-Z\d])?)/
    );
    if (isGiveBounty) {
      await giveBounty({
        issueUrl,
        reponame,
        username,
        body,
        payload,
        octokit,
      });
    } else {
      const match = body.match(/\/bounty \$(\d+(?:\.\d{1,2})?)/);

      if (!match) return;
      await newBounty({ issueUrl, reponame, username, body, payload, octokit });
    }
  } catch (error) {}
}

export { webhookMiddleware };
