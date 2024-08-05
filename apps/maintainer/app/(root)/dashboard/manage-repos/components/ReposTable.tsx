"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";
import TableRowComponent from "./TableRow";
import { IGithubRepo } from "../types";
import { Repo } from "@repo/db";
import axios from "axios";
import { Session, User } from "next-auth";

const ReposTable = ({
  userRepos,
  session,
}: {
  userRepos: Repo[];
  session: Session;
}) => {
  const [repos, setRepos] = useState<IGithubRepo[]>([]);

  const getUserRepos = useCallback(async () => {
    try {
      const res = await axios.get(`https://api.github.com/user/repos`, {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      });
      setRepos(res.data);
    } catch (error) {}
  }, [session.user.accessToken]);

  useEffect(() => {
    getUserRepos();
  }, [getUserRepos]);
  return (
    <div>
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
          {repos.map((repo, index) => (
            <TableRowComponent
              repo={repo}
              key={index}
              index={index}
              inSync={userRepos.some(
                (item) => item.reponame === `${repo.full_name}`
              )}
              session={session}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReposTable;
