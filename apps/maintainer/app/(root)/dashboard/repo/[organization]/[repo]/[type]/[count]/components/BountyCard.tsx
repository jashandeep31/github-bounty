"use client";
import { Bounty, Issue } from "@repo/db";
import { Badge } from "@repo/ui/badge";
import { buttonVariants } from "@repo/ui/button";
import { cn } from "@repo/ui/utils";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const BountyCard = ({ issue, bounty }: { issue: Issue; bounty: Bounty }) => {
  const [isClientSide, setIsClientSide] = useState(false);

  useEffect(() => {
    setIsClientSide(true);
  }, []);

  if (!isClientSide) return null;
  return (
    <div>
      <Link
        href={issue.link}
        target="__blank"
        className="border p-2 hover:bg-muted duration-300 block rounded-xl"
      >
        <Badge>Bounty</Badge>
        <div>
          <ul className="my-3 space-y-1 ">
            <li>
              Amount: <span className="font-bold">{bounty.amount} USDT</span>
            </li>
            <li>
              Status:{" "}
              <span className="font-bold text-foreground">
                {bounty.isOpen ? "Ongoing" : "Closed"}
              </span>
            </li>
            <li>
              Created By:{" "}
              <span className="font-bold">{bounty.generatedBy}</span>
            </li>
            <li>
              Created At:{" "}
              <span className="font-bold">
                {bounty.createdAt.toLocaleDateString()}{" "}
                {bounty.createdAt.toLocaleTimeString()}
              </span>
            </li>
          </ul>
          <div className="flex justify-end">
            <Link
              href={issue.link}
              target="__blank"
              className={cn(buttonVariants({ variant: "default" }))}
            >
              View Issue
            </Link>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BountyCard;
