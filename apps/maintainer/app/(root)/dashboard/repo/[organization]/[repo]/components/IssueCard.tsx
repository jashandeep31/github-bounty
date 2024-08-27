"use client";
import { Issue } from "@repo/db";
import { buttonVariants } from "@repo/ui/button";
import { cn } from "@repo/ui/utils";
import { CircleDot } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const IssueCard = ({ issue }: { issue: Issue }) => {
  const [isClientSide, setIsClientSide] = useState(false);
  useEffect(() => {
    setIsClientSide(true);
  }, []);

  if (!isClientSide) return null;
  return (
    <Link
      href={issue.link.replace("https://github.com/", "/dashboard/repo/")}
      className="border rounded p-3 hover:bg-muted duration-300 mt-5 block"
    >
      <h2 className="font-bold flex items-center gap-1 my-1">
        <CircleDot size={16} className="text-green-500" />
        <span>{issue.title}</span>
      </h2>
      <p className="text-xs text-muted-foreground ">
        {issue.createdAt.toLocaleDateString()}{" "}
        {issue.createdAt.toLocaleTimeString()}
      </p>
      <div className="mt-3 ml-3">
        {!issue.body ? (
          <span className="text-muted-foreground text-xs">
            Issue/pull doesn&apos;t contain body
          </span>
        ) : (
          <span className="text-muted-foreground text-xs">{issue.body}</span>
        )}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Link
          className={cn(buttonVariants({ variant: "default", size: "sm" }))}
          href={issue.link.replace("https://github.com/", "/dashboard/repo/")}
        >
          In depth view
        </Link>
        <Link
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          href={issue.link}
        >
          Open in Github
        </Link>
      </div>
    </Link>
  );
};

export default IssueCard;
