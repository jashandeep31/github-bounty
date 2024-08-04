"use client";
import React from "react";
import { TableCell, TableRow } from "@repo/ui/table";
import Link from "next/link";
import { Button } from "@repo/ui/button";
import { RotateCw } from "lucide-react";
import { IGithubRepo } from "../types";
import axios from "axios";
import { Session } from "next-auth";

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
  const refreshStatus = async (reponame: string) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/app/check-access/${session.user.username}/${reponame}`
      );
      console.log(res);
    } catch (error) {
      console.log(error);
    }
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
      <TableCell>{repo.private ? "True" : "False"}</TableCell>
      <TableCell className="text-right ">
        <div className="flex items-center gap-2 justify-end">
          <Button variant={"outline"} size={"sm"}>
            Install
          </Button>
          <button onClick={() => refreshStatus(repo.name)}>
            <RotateCw size={16} />
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default TableRowComponent;
