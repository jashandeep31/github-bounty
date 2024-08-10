"use client";
import { Button } from "@repo/ui/button";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import WalletActions from "./components/WalletActions";
import { Payment } from "@repo/db";
import { getOrganizationPayments } from "./_actions";
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

const Page = () => {
  const session = useSession();
  const [walletActionState, setWalletActionState] = useState<boolean>(false);
  const [pastPayments, setPastPayments] = useState<Payment[]>([]);

  const wallet = useWalletProvider();
  const getPayments = useCallback(async () => {
    setPastPayments(await getOrganizationPayments());
  }, []);

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
        <div className="border-foreground p-3 rounded-md border inline-block">
          <h2 className="md:text-4xl text-lg font-bold">
            USDT {wallet.state === "loading" ? ".." : null}
            {wallet.state === "connected" ? wallet.amount : null}
          </h2>
        </div>
        <div className="mt-6">
          <Button onClick={() => setWalletActionState(true)}>Add Funds</Button>
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
      </div>
    </div>
  );
};

export default Page;
