// TODO: remove this my manging the function in the index.ts
import dotenv from "dotenv";
dotenv.config();
import { createNodeMiddleware } from "@octokit/webhooks";
import fs from "fs";
import path from "path";
import { App } from "@octokit/app";
import jwt from "jsonwebtoken";

const privateKeyPath = path.resolve("./gitsolapp.2024-08-03.private-key.pem");
const octokitApp = new App({
  appId: process.env.APP_ID ?? "",
  privateKey: fs.readFileSync(privateKeyPath, "utf8"),
  webhooks: { secret: process.env.WEBHOOK_SECRET ?? "" },
});

const webhookMiddleware = createNodeMiddleware(octokitApp.webhooks, {
  path: "/api/webhook",
});

octokitApp.webhooks.on("pull_request.reopened", () => console.log(`first`));

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

// export const tesingOctokit = async () => {};
// console.log(`test is rnning`);
// let url = await octokitApp.oauth();
// console.log(url);

export { webhookMiddleware };
