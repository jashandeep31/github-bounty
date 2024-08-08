import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";
import IssueCard from "./components/IssueCard";

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
      <h1 className="md:text-2xl text-lg font-bold">{repo.reponame}</h1>
      <p className="text-sm text-muted-foreground">
        This page includes all the issues cotaining the bouties in them.
      </p>

      <div className="space-y-3 mt-6">
        <h3 className="md:text-lg font-bold">Opened Pull Request / Issues</h3>
        {repo.Issue.map((item) => (
          <IssueCard issue={item} key={item.id} />
        ))}
      </div>
    </div>
  );
}
