import { db } from "@/lib/db";
import React from "react";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import PayoutTableComponent from "./components/payoutTable";

async function getPayouts(username: string) {
  return await db.payout.findMany({
    where: {
      generatedTo: username,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
export default async function page() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  const payouts = await getPayouts(session.user.username);
  return (
    <div className="container md:mt-12 mt-6">
      <h1 className="text-lg font-bold md:text-2xl">Your Payouts</h1>
      <p className="text-sm text-muted-foreground">List of recent of payouts</p>

      <div className="mt-6">
        <PayoutTableComponent payouts={payouts} />
      </div>
    </div>
  );
}
