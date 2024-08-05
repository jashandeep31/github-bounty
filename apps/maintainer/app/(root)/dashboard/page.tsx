import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";
import Link from "next/link";
import { Button, buttonVariants } from "@repo/ui/button";
import { cn } from "@repo/ui/utils";

async function getCurrentRepos(id: string) {
  return await db.repo.findMany({
    where: {
      organizationId: id,
    },
  });
}

async function page() {
  const session = await auth();
  if (!session?.user || !session?.organization) {
    return redirect("/login");
  }
  const currentRepos = await getCurrentRepos(session.organization.id);
  return (
    <div className="container md:mt-12 mt-6">
      <h1>Currnet Repos</h1>
      <p className="text-sm text-muted-foreground ">
        List of repos those are synced with us.
      </p>

      <Link
        className={cn(buttonVariants(), "my-4")}
        href={"/dashboard/manage-repos"}
      >
        Manage Repos
      </Link>
      <Table className="mt-3">
        <TableCaption>A list of your public repos.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">S.no</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Connected</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentRepos.map((repo, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{++index}</TableCell>
              <TableCell>
                <Link
                  href={repo.link}
                  target="__blank"
                  className="text-muted-foreground underline hover:text-foreground duration-300"
                >
                  {repo.reponame}
                </Link>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span>Connected</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Link
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" })
                  )}
                  href={`/dashboard/repo/${repo.reponame}`}
                >
                  Details
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default page;
