import { db } from "@/lib/db";
import React from "react";

import BountyCard from "./components/bountyCard";

async function getBounties() {
  return await db.bounty.findMany({
    where: {
      isOpen: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: { issue: true },
  });
}
export default async function page() {
  const bounties = await getBounties();
  return (
    <div className="container md:mt-12 mt-6">
      <div>
        <span className="border-2 border-muted-foreground rounded-full py-1 px-3 inline-flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span>Live Bounties</span>
        </span>
      </div>
      <h1 className="text-lg mt-4 font-bold md:text-2xl">Ongoing Bounties</h1>
      <p className="text-sm text-muted-foreground">
        Here is the list of all the ongoing bounties. Participate in your
        favorite one.
      </p>

      <div className="mt-6">
        {bounties.map((bounty) => (
          <BountyCard bounty={bounty} issue={bounty.issue} key={bounty.id} />
        ))}
      </div>
    </div>
  );
}
