"use client";
import { Issue } from "@repo/db";
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
      <h2 className="font-bold flex justify-between">
        {issue.title}{" "}
        <span className="lowercase text-xs border p-1 rounded-full border-foreground">
          {issue.status}
        </span>{" "}
      </h2>

      <div className="mt-3 ml-3">
        {issue.body ? (
          issue.body
        ) : (
          <span className="text-muted-foreground text-xs">
            Issue/pull doesn&apos;t contain body
          </span>
        )}
      </div>
      <div className="mt-6">
        <Link
          className="text-sm text-muted-foreground hover:text-foreground duration-300 underline"
          href={issue.link}
        >
          Github
        </Link>
      </div>
    </Link>
  );
};

export default IssueCard;
