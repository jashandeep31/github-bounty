import { auth } from "@/lib/auth";
import { verifyUserBasicAuthAndBasicOrganizationValidation } from "@/lib/authentication";
import { db } from "@/lib/db";

import React from "react";
import PayoutsTable from "./components/PayoutsTable";

async function getPayouts(orgId: string, page: number) {
  return await db.payout.findMany({
    where: {
      organizationId: orgId,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: (page - 1) * 10,
    take: 11,
  });
}
export default async function page({
  searchParams,
}: {
  searchParams: { page: string };
}) {
  const pageNo = isNaN(parseInt(searchParams.page))
    ? 1
    : parseInt(searchParams.page);

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
  const payouts = await getPayouts(session.organization.id, pageNo);
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
