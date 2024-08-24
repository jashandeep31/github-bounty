import { Bounty, Issue, Organization, Payout } from "@repo/db";
import { db } from "../lib/db.js";
import {
  checkDispenserPermissions,
  fetchOrCreateIssue,
  fetchOrCreateRepo,
} from "./handlers.js";
import z from "zod";
import { putItemInPayoutQueue } from "../queue/index.js";

export const giveBounty = async ({
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
  const bountyData = body.match(
    /\/give-bounty \$(\d+(?:\.\d{1,2})?) @([a-zA-Z\d](?:[a-zA-Z\d-]{0,38}[a-zA-Z\d])?)/
  );

  if (!bountyData || Number(bountyData[1]) <= 0) return;
  const bountyAmountResult = z.coerce.number().safeParse(bountyData[1]);
  if (!bountyAmountResult.success || bountyAmountResult.data <= 0) {
    return;
  }
  const bountyUsernameResult = z.coerce.string().safeParse(bountyData[2]);
  if (!bountyUsernameResult.success) {
    return;
  }

  const bountyAmount = bountyAmountResult.data;
  const bountyUsername = bountyUsernameResult.data.replace("@", "").trim();
  const repo = await fetchOrCreateRepo(reponame);
  const organization = repo.organization;
  const isAllowedDispenser = checkDispenserPermissions(organization, username);

  if (!isAllowedDispenser) return;

  const issue = await fetchOrCreateIssue(
    issueUrl,
    payload.issue.title,
    payload.issue.body,
    repo.id,
    organization.id
  );

  const bountiesOfIssue = await db.bounty.findMany({
    where: {
      issueId: issue.id,
      amount: bountyAmount,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  console.log(`this is working`);
  const transaction = await processBounty({
    bountyAmount,
    username,
    organization,
    bountyUsername,
    issue,
    bountiesOfIssue,
  });

  const isUser = await db.user.findUnique({
    where: {
      username: transaction.payout.generatedTo,
    },
  });
  const message = `
  🎉 Congratulations! A new bounty of amount ${transaction.bounty.amount} has been generated.
  🏆 The winner of the bounty is @${transaction.payout.generatedTo}, announced by @${transaction.payout.generatedBy}.
  
  ${
    !isUser
      ? `📢 We noticed that @${transaction.payout.generatedTo}, you don't have an account on our website. Please create your account. If this is done within 30 minutes, you will receive your bounty in your crypto wallet. 
  In case you can't, don't worry! You can still claim it from your account section after creating an account.`
      : ``
  }
  ${!isUser?.publicKey ? "🔑 Dear winner, please connect your wallet to your account to receive your payment." : ""}
  `;

  try {
    // octokit.request(
    //   "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",

    //   {
    //     owner: payload.repository.owner.login,
    //     repo: payload.repository.name,
    //     issue_number: payload.issue.number,
    //     body: message,
    //   }
    // );
    console.log(`done`);
  } catch (error: any) {
    if (error.response) {
    }
  }
};
const processBounty = async ({
  bountyAmount,
  username,
  issue,
  organization,
  bountyUsername,
  bountiesOfIssue,
}: {
  bountyAmount: number;
  username: string;
  issue: Issue;
  organization: Organization;
  bountyUsername: string;
  bountiesOfIssue: Bounty[];
}): Promise<{ payout: Payout; bounty: Bounty }> => {
  const transaction = await db.$transaction(async (tx) => {
    console.log(bountiesOfIssue[0]);
    const bounty = await tx.bounty.upsert({
      where: {
        id: bountiesOfIssue[0]?.id,
      },
      update: {
        isOpen: false,
      },
      create: {
        amount: bountyAmount,
        generatedBy: username,
        issueId: issue.id,
        isOpen: false,
      },
    });

    const payout = await tx.payout.create({
      data: {
        organizationId: organization.id,
        generatedTo: bountyUsername,
        generatedBy: username,
        link: issue.link,
        amount: bountyAmount,
        status: "PRE_PROCESSING",
        issueId: issue.id,
      },
    });
    console.log(`in process`);
    await putItemInPayoutQueue(payout.id);
    console.log(`is bounty`);

    return { payout, bounty };
  });
  return transaction;
};
