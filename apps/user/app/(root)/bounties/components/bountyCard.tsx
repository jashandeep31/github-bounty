"use client";
import { Bounty, Issue } from "@repo/db";
import { Badge } from "@repo/ui/badge";
import { buttonVariants } from "@repo/ui/button";
import { cn } from "@repo/ui/utils";
import { CircleDot } from "lucide-react";
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
        <div className="">
          <h2 className="font-bold text-lg flex items-center gap-1 mt-2">
            <CircleDot size={16} className="text-green-500" />
            <span>{issue.title}</span>
          </h2>
          <ul className="mt-1 space-y-1 px-3 text-muted-foreground">
            <li>
              Amount: <span className="font-bold">{bounty.amount} USDT</span>
            </li>
            <li>
              Status:{" "}
              <span className="font-bold ">
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
