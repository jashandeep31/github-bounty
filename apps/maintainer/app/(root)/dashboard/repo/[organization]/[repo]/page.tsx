import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";
import IssueCard from "./components/IssueCard";
import { FolderGit } from "lucide-react";
import Link from "next/link";
import { cn } from "@repo/ui/utils";
import { buttonVariants } from "@repo/ui/button";

async function getRepo(reponame: string) {
  return await db.repo.findUnique({
    where: {
      reponame,
    },
    include: {
      Issue: {
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
  params: { organization: string; repo: string };
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

  const repo = await getRepo(`${params.organization}/${params.repo}`);
  if (!repo) {
    return <h1 className="container md:mt-12 mt-6">Repo not found 404</h1>;
  }
  return (
    <div className="container md:mt-12 mt-6">
      <h1 className="md:text-2xl text-lg font-bold flex items-center gap-2">
        <FolderGit size={20} className="text-blue-500" />
        <span>{repo.reponame}</span>
      </h1>
      <p className="text-sm text-muted-foreground">
        This page includes all the issues cotaining the bouties in them.
      </p>

      <div className="space-y-3 mt-6">
        <h3 className="md:text-lg font-bold">Opened Pull Request / Issues</h3>
        {repo.Issue.map((item) => (
          <IssueCard issue={item} key={item.id} />
        ))}

        {repo.Issue.length === 0 && (
          <div className="flex flex-col gap-6  py-12 items-center">
            <h1 className="text-xl font-bold text-muted-foreground  ">
              You don&apos;t have any issues in this repo. Please create one.
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
    </div>
  );
}
