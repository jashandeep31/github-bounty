import { db } from "@/lib/db";
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

async function getBounties() {
  return await db.bounty.findMany({
    where: {
      isOpen: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: { issue: true },
  });
}
export default async function page() {
  const bounties = await getBounties();
  return (
    <div className="container md:mt-12 mt-6">
      <div>
        <span className="border-2 border-black rounded-full py-1 px-3 inline-flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span>Live Bounties</span>
        </span>
      </div>
      <h1 className="text-lg mt-4 font-bold md:text-2xl">Ongoing Bounties</h1>
      <p className="text-sm text-muted-foreground">
        Here is the list of all the ongoing bounties. Participate in your
        favorite one.
      </p>

      <div className="mt-6">
        <Table>
          <TableCaption>A list of recently opened bounties.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">S.no</TableHead>
              <TableHead>Link</TableHead>
              <TableHead className="text-right">Generated By</TableHead>
              <TableHead className="text-right">Created At</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bounties.map((bounty, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{++index}</TableCell>
                <TableCell>
                  <Link
                    href={bounty.issue.link}
                    target="__blank"
                    className="underline hover:text-foreground text-muted-foreground duration-300"
                  >
                    {bounty.issue.link}
                  </Link>
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`https://github.com/${bounty.generatedBy}`}
                    target="__blank"
                    className="underline hover:text-foreground text-muted-foreground duration-300"
                  >
                    {bounty.generatedBy}
                  </Link>
                </TableCell>
                <TableCell className="text-right">
                  {" "}
                  <div className="font-medium">
                    {bounty.createdAt.toLocaleDateString()}
                  </div>
                  <div className="hidden text-sm text-muted-foreground md:inline">
                    {bounty.createdAt.toLocaleTimeString()}
                  </div>
                </TableCell>
                <TableCell className="text-right">${bounty.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
