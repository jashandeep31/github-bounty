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
        Add Repo
      </Link>
      <Table className="mt-3">
        <TableCaption>A list of your public repos.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">S.no</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Private</TableHead>
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
              <TableCell></TableCell>
              <TableCell className="text-right">
                <Button variant={"outline"} size={"sm"}>
                  Install
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default page;
