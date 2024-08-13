import { Organization } from "@repo/db";
import { db } from "../lib/db.js";

export async function fetchOrCreateRepo(reponame: string) {
  let isRepo = await db.repo.findUnique({
    where: {
      reponame: reponame,
    },
    include: {
      organization: true,
    },
  });

  if (!isRepo) {
    // first check for repo
    let isOrganization = await db.organization.findUnique({
      where: {
        name: reponame.split("/")[0],
      },
    });
    if (!isOrganization) throw new Error("");

    return await db.repo.create({
      data: {
        reponame: reponame,
        link: `https://github.com/` + reponame,
        organizationId: isOrganization.id,
        totalIssues: 0, //TODO add this to default
      },
      include: {
        organization: true,
      },
    });
  }
  return isRepo;
}

export function checkDispenserPermissions(
  organization: Organization,
  username: string
) {
  if (organization.allowedDispancers.includes(username)) return true;
  return null;
}

export async function fetchOrCreateIssue(
  link: string,
  title: string,
  body: string,
  repoId: string,
  organizationId: string
) {
  const isIssue = await db.issue.findUnique({
    where: {
      link,
    },
  });
  if (!isIssue) {
    return await db.issue.create({
      data: {
        link: link,
        title: title,
        body: body ? body : "",
        organizationId: organizationId,
        status: "OPEN",
        repoId: repoId,
        bountiesPrice: 0, //TODO add this to default
      },
    });
  }
  return isIssue;
}
