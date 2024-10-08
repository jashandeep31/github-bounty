"use client";
import { Payout } from "@repo/db";
import React from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";

import { useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@repo/ui/pagination";
import { cn } from "@repo/ui/utils";
import PayoutsTableRow from "./payoutsTableRow";

const PaginationComponent = ({
  page,
  payouts,
}: {
  page: number;
  payouts: Payout[];
}) => {
  return (
    <Pagination className="mt-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={
              page <= 1
                ? `/dashboard/payouts?page=1`
                : `/dashboard/payouts?page=${page - 1}`
            }
            shallow
            className={cn(page <= 1 && "text-muted opacity-50")}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            {page}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            className={cn(payouts.length <= 10 && "text-muted opacity-50")}
            href={
              payouts.length > 10
                ? `/dashboard/payouts?page=${page + 1}`
                : `/dashboard/payouts?page=${page}`
            }
            shallow
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

const PayoutsTable = ({ payouts }: { payouts: Payout[] }) => {
  const searchParams = useSearchParams();
  const page = isNaN(parseInt(searchParams.get("page") ?? "1"))
    ? 1
    : parseInt(searchParams.get("page") ?? "1");

  return (
    <div className="mt-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Winner</TableHead>
            <TableHead className="hidden sm:table-cell">Generated By</TableHead>
            <TableHead className="hidden sm:table-cell">Status</TableHead>
            <TableHead className="hidden md:table-cell">Date</TableHead>
            <TableHead className="text-left">Amount</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payouts.slice(0, 10).map((payout) => (
            <PayoutsTableRow payout={payout} key={payout.id} />
          ))}
        </TableBody>
      </Table>
      <PaginationComponent payouts={payouts} page={page} />
    </div>
  );
};

export default PayoutsTable;
