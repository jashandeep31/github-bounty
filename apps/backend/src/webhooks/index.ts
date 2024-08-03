// TODO: remove this my manging the function in the index.ts
import dotenv from "dotenv";
dotenv.config();
import { createNodeMiddleware } from "@octokit/webhooks";
import fs from "fs";
import path from "path";
import { App } from "@octokit/app";

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

// Tasks I have to hanle
// 1. create a new task contain /bounty $5
// 2. somebody create a pull request in which comment /give-bounty $5 @username
// 3. catch every comment on the issue or the pull request

export { webhookMiddleware };
