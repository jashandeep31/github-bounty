import { db } from "../lib/db.js";
import {
  checkDispenserPermissions,
  fetchOrCreateIssue,
  fetchOrCreateRepo,
} from "./handlers.js";

export const newBounty = async ({
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
}) => {
  const match = body.match(/\/bounty \$(\d+(?:\.\d{1,2})?)/);
  if (!match) return;

  const repo = await fetchOrCreateRepo(reponame);
  const organization = repo.organization;
  const isAllowedDispenser = checkDispenserPermissions(organization, username);
  console.log(username, organization.allowedDispancers);
  if (!isAllowedDispenser) return;
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
  🎉 Congratulations! Your bounty has been successfully registered and will be visible on our website.
  🏅 To award the bounty, use the command \`/give-bounty $${bounty.amount} @username\`.
  
  ${bounty.amount > organization.balance ? "⚠️ Please note: Your wallet balance is currently less than the bounty amount. Ensure you recharge your wallet before dispensing the bounty." : ""}
  
  Copy command to give bouny
  \`\`\`
  /give-bounty $${bounty.amount} @
  \`\`\`

  🙏 Thank you, @${username}.
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
};
