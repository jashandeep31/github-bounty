"use server";

import { auth } from "@/lib/auth";
import { verifyUserBasicAuthAndProperOrganization } from "@/lib/authentication";
import { db } from "@/lib/db";

export async function getOrganizationWalletAmount(): Promise<null | number> {
  const _session = await auth();
  const session = _session
    ? verifyUserBasicAuthAndProperOrganization(_session)
    : null;

  if (!session) return null;
  const organization = await db.organization.findUnique({
    where: {
      id: session.organization.id,
    },
  });
  if (!organization?.balance) return null;
  return organization.balance;
}
