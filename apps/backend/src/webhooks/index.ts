// TODO: remove this my manging the function in the index.ts
import dotenv from "dotenv";
dotenv.config();
import { createNodeMiddleware } from "@octokit/webhooks";
import fs from "fs";
import path from "path";
import { App } from "@octokit/app";
import jwt from "jsonwebtoken";
import { db } from "../lib/db.js";
import {
  checkDispenserPermissions,
  fetchOrCreateIssue,
  fetchOrCreateRepo,
} from "./handlers.js";

const privateKeyPath = path.resolve("./gitsolapp.2024-08-03.private-key.pem");
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

octokitApp.webhooks.on("pull_request.reopened", () => console.log(`first`));
octokitApp.webhooks.on("issues.opened", () => {
  console.log(`isssue is opened`);
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
  const match = body.match(/\/bounty \$(\d+(?:\.\d{1,2})?)/);
  if (!match) return;
  const repo = await fetchOrCreateRepo(reponame);
  const organization = repo.organization;
  const isAllowedDispenser = checkDispenserPermissions(organization, username);
  // add message of if not enough balncer in the comment of reply

  const issue = await fetchOrCreateIssue(
    issueUrl,
    payload.issue.title,
    payload.issue.body,
    repo.id,
    organization.id
  );

  const bounty = await db.bounty.create({
    data: {
      amount: Number(match[1]),
      generatedBy: username,
      issueId: issue.id,
    },
  });

  const message = `
Congratulations! Your bounty has been successfully registered and will be visible on our website.
To award the bounty, use the command \`/give-bounty $100 @username\`.

${bounty.amount > organization.balance ? "Please note: Your wallet balance is currently less than the bounty amount. Ensure you recharge your wallet before dispensing the bounty." : ""}

Thank you, @${username}.
`;
  console.log(message);

  try {
    octokit.request(
      "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",

      {
        owner: payload.repository.owner.login,
        repo: payload.repository.name,
        issue_number: payload.issue.number,
        body: message,
      }
    );
    console.log(`done`);
  } catch (error: any) {
    if (error.response) {
      console.error(
        `Error! Status: ${error.response.status}. Message: ${error.response.data.message}`
      );
    }
    console.error(error);
  }
}

export { webhookMiddleware };
