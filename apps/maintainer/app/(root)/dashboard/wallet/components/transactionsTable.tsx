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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@repo/ui/pagination";
import { cn } from "@repo/ui/utils";
import { Payment } from "@repo/db";

const TransactionsTable = ({
  pastPayments,
  pageNo,
}: {
  pastPayments: Payment[];
  pageNo: number;
}) => {
  return (
    <div className="md:mt-12 mt-6">
      <h3 className="text-lg font-bold">Past Payments</h3>
      <Table>
        <TableCaption>A list of your recent payments.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">S.no</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>To</TableHead>
            <TableHead className="text-right">Body</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pastPayments.map((payment, i) => (
            <TableRow key={payment.id}>
              <TableCell className="font-medium">{++i}</TableCell>
              <TableCell>{payment.initialAmount.toFixed(2)}</TableCell>
              <TableCell>
                {payment.paidToCompany
                  ? "Company wallet (wallet funds)"
                  : "Make payout"}
              </TableCell>
              <TableCell className="">{payment.body}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={
                pageNo <= 1
                  ? `/dashboard/wallet?page=1`
                  : `/dashboard/wallet?page=${pageNo - 1}`
              }
              shallow
              className={cn(pageNo <= 1 && "text-muted opacity-50")}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              {" "}
              {pageNo}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              className={cn(
                pastPayments.length <= 10 && "text-muted opacity-50"
              )}
              shallow
              href={
                pastPayments.length > 10
                  ? `/dashboard/wallet?page=${pageNo + 1}`
                  : `/dashboard/wallet?page=${pageNo}`
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default TransactionsTable;
