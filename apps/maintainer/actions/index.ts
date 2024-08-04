import { db } from "@/lib/db";

export async function getReposByOrganizationID(id: string) {
  const repos = await db.repo.findMany({
    where: {
      organizationId: id,
    },
  });
  return repos;
}
