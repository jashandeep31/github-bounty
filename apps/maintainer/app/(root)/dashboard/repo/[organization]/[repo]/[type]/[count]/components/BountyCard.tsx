"use client";
import { Bounty, Issue } from "@repo/db";
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
        className="border  hover:bg-muted duration-300 block p-3 rounded"
      >
        <h3 className="text-muted-foreground">
          Bounty of amount{" "}
          <span className="font-bold text-foreground">
            {bounty.amount} USDT
          </span>{" "}
          is opened by{" "}
          <Link
            href={`https://github.com/${bounty.generatedBy}`}
            className="text-muted-foreground underline 
    hover:text-foreground duration-300"
          >
            {" "}
            {bounty.generatedBy}{" "}
          </Link>
        </h3>
      </Link>
    </div>
  );
};

export default BountyCard;
