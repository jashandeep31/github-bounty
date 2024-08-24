import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import BountyCard from "./components/BountyCard";
import { CircleDot } from "lucide-react";

async function getIssue(link: string) {
  link = `https://github.com/` + link;
  console.log(`https://github.com/jashandeep31/typescript-blank/issues/3`);
  return await db.issue.findUnique({
    where: { link },
    include: {
      Bounty: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}

export default async function page({
  params,
}: {
  params: { organization: string; repo: string; type: string; count: string };
}) {
  const session = await auth();
  if (!session?.user || !session.organization) {
    return redirect("/login");
  }

  if (session?.user.username !== params.organization) {
    return (
      <div className="container md:mt-12 mt-6">
        <h1>Organization does not belongs to you. Please re-authenticate</h1>
      </div>
    );
  }

  const issue = await getIssue(
    `${params.organization}/${params.repo}/${params.type}/${params.count}`
  );
  if (!issue) {
    return <h1 className="container smd:mt-12 mt-6">Issue not found 404</h1>;
  }
  return (
    <div className="container md:mt-12 mt-6">
      <h1 className="md:text-2xl text-lg font-bold flex items-center gap-2">
        <CircleDot size={20} className="text-green-500" />
        <span>{issue.title}</span>
      </h1>
      <div className="mt-3 ml-3 text-muted-foreground text-sm">
        {issue.body ? (
          issue.body
        ) : (
          <span>Issue/pull doesn&apos;t contain body</span>
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-bold">Ongoing Bounties</h3>
        <div className="mt-3 space-y-6">
          {issue.Bounty.map((bounty) => (
            <BountyCard issue={issue} bounty={bounty} key={bounty.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
