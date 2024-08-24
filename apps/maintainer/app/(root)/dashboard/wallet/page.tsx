"use client";
import { Button } from "@repo/ui/button";
import { useSession } from "next-auth/react";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import WalletActions from "./components/WalletActions";
import { Payment } from "@repo/db";
import { getOrganizationPayments, unlinkWallet } from "./_actions";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";
import { useWalletProvider } from "@/providers/walletContextProvider";
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

const PageComponent = () => {
  const searchParams = useSearchParams();

  const pageNo = isNaN(parseInt(searchParams.get("page") ?? "1"))
    ? 1
    : parseInt(searchParams.get("page") ?? "1");
  const session = useSession();
  const [walletActionState, setWalletActionState] = useState<boolean>(false);
  const [pastPayments, setPastPayments] = useState<Payment[]>([]);

  const wallet = useWalletProvider();
  const getPayments = useCallback(async () => {
    setPastPayments(await getOrganizationPayments(pageNo));
  }, [pageNo]);

  useEffect(() => {
    getPayments();
  }, [getPayments]);

  if (session?.status === "loading")
    return (
      <h1 className="text-xl  md:mt-12 mt-6 font-bold container">
        Loading ...
      </h1>
    );

  if (!session.data?.organization)
    return (
      <h1 className="text-xl font-bold container md:mt-12 mt-6 ">
        Please re-login unable to load wallet
      </h1>
    );
  return (
    <div className="container md:mt-12 mt-6">
      {walletActionState ? (
        <WalletActions
          session={session.data}
          setWalletActionState={setWalletActionState}
          walletActionState={walletActionState}
        />
      ) : null}
      <div className="">
        <div className="border-muted p-3 rounded-md border inline-block">
          <h2 className="md:text-4xl text-lg font-bold">
            USDT {wallet.state === "loading" ? ".." : null}
            {wallet.state === "connected" ? wallet.amount : null}
          </h2>
        </div>
        <div className="mt-6 space-x-4">
          <Button onClick={() => setWalletActionState(true)}>Add Funds</Button>
          {session.data.organization.publicKey && (
            <Button
              onClick={() => {
                unlinkWallet();
              }}
              variant={"outline"}
              className="border-red-500 text-red-500 hover:text-white hover:bg-red-500 duration-300"
            >
              Unlink wallet
            </Button>
          )}
        </div>
      </div>
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
                <TableCell className="text-right">{payment.body}</TableCell>
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
    </div>
  );
};

const Page = () => {
  return (
    <Suspense>
      <PageComponent></PageComponent>
    </Suspense>
  );
};

export default Page;
