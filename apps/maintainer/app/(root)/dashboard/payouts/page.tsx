import { auth } from "@/lib/auth";
import { verifyUserBasicAuthAndBasicOrganizationValidation } from "@/lib/authentication";
import { db } from "@/lib/db";

import React from "react";
import PayoutsTable from "./components/PayoutsTable";
import Link from "next/link";
import { buttonVariants } from "@repo/ui/button";
import { cn } from "@repo/ui/utils";

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

      {payouts.length === 0 && (
        <div className="flex flex-col gap-6  py-12 items-center">
          <h1 className="text-xl font-bold text-muted-foreground  ">
            You don&apos;t have any payouts. Please create one.
          </h1>
          <Link
            href={
              "https://jashandeep.notion.site/Docs-of-GitSol-8ba6ea37503a46829caecfe54bc3f637"
            }
            className={cn(buttonVariants())}
          >
            Check Docs
          </Link>
        </div>
      )}
    </div>
  );
}
