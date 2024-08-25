"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";
import { Payout } from "@repo/db";
import PayoutTableRow from "./payoutTableRow";

const PayoutTableComponent = ({ payouts }: { payouts: Payout[] }) => {
  return (
    <Table>
      <TableCaption>A list of recently opened bounties.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">S.no</TableHead>
          <TableHead>Link</TableHead>
          <TableHead className="text-right">Status</TableHead>
          <TableHead className="text-right">Generated By</TableHead>
          <TableHead className="text-right">Created At</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payouts.map((payout, index) => (
          <PayoutTableRow key={payout.id} payout={payout} index={index} />
        ))}
      </TableBody>
    </Table>
  );
};

export default PayoutTableComponent;