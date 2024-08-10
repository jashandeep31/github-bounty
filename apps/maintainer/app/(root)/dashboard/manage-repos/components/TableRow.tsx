"use client";
import React, { useState } from "react";
import { TableCell, TableRow } from "@repo/ui/table";
import Link from "next/link";
import { Button, buttonVariants } from "@repo/ui/button";
import { RotateCw } from "lucide-react";
import { IGithubRepo } from "../types";
import axios from "axios";
import { Session } from "next-auth";
import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";
import { cn } from "@repo/ui/utils";

const TableRowComponent = ({
  repo,
  index,
  inSync,
  session,
}: {
  repo: IGithubRepo;
  index: number;
  inSync: boolean;
  session: Session;
}) => {
  const router = useRouter();
  const [refreshButtonState, setRefreshButtonState] = useState<
    null | "loading"
  >(null);
  const refreshStatus = async (reponame: string) => {
    try {
      setRefreshButtonState("loading");
      const res = await axios.get(
        `http://localhost:8000/api/v1/app/check-access/${reponame}`
      );
      if (res.status === 200) {
        router.refresh();
      }
    } catch (error) {}
    setRefreshButtonState(null);
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{++index}</TableCell>
      <TableCell>
        <Link
          href={repo.html_url}
          target="__blank"
          className="text-muted-foreground underline hover:text-foreground duration-300"
        >
          {repo.name}
        </Link>
      </TableCell>
      <TableCell>
        {" "}
        {inSync ? (
          <div className="flex items-center gap-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span>Connected</span>
          </div>
        ) : (
          "Not connected"
        )}
      </TableCell>
      <TableCell className="text-right ">
        {inSync ? (
          <div className="flex justify-end gap-2 items-center"></div>
        ) : (
          <div className="flex items-center gap-2 justify-end">
            <Link
              href={"https://github.com/apps/gitsolapp/installations/new"}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Install
            </Link>
            <button
              disabled={refreshButtonState === "loading"}
              onClick={() => refreshStatus(repo.full_name)}
            >
              <RotateCw
                size={16}
                className={!refreshButtonState ? "" : "animate-spin"}
              />
            </button>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
};

export default TableRowComponent;
