import { auth } from "@/lib/auth";
import { verifyUserBasicAuthAndBasicOrganizationValidation } from "@/lib/authentication";
import { db } from "@/lib/db";

import React from "react";
import PayoutsTable from "./components/PayoutsTable";

async function getPayouts(orgId: string) {
  return await db.payout.findMany({
    where: {
      organizationId: orgId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
export default async function page() {
  const _session = await auth();
  const session = _session
    ? verifyUserBasicAuthAndBasicOrganizationValidation(_session)
    : null;

  if (!session)
    return (
      <h1 className="container md:mt-12 mt-6">
        Please re-login authentication failed{" "}
      </h1>
    );
  const payouts = await getPayouts(session.organization.id);
  return (
    <div className="container md:mt-12 mt-6">
      <h1 className="md:text-2xl text-lg font-bold">Payouts</h1>
      <p className="text-sm text-muted-foreground">
        List of all payouts currently going on.
      </p>
      <PayoutsTable payouts={payouts} />
    </div>
  );
}
