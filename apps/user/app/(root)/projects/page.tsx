import { db } from "@/lib/db";
import Link from "next/link";
import React from "react";

export const revalidate = 10;
async function getRepos() {
  return await db.repo.findMany();
}

export default async function page() {
  const repos = await getRepos();
  return (
    <div className="container md:mt-12 mt-6">
      <h1 className="text-lg md:text-2xl font-bold">Projects</h1>
      <p className="text-sm text-muted-foreground">
        Here is the list of projects we are supporting now
      </p>
      <div className="grid md:grid-cols-4 gap-5 mt-5">
        {repos.map((repo) => (
          <Link
            href={repo.link}
            key={repo.id}
            className="border rounded-md p-3 hover:scale-105 duration-300"
          >
            <h2 className="text-lg font-bold capitalize">
              {repo.reponame.split("/")[1]?.split("-").join(" ")}
            </h2>
            <p className="text-sm text-muted-foreground">
              By: {repo.reponame.split("/")[0]}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
