"use client";
import { Button, buttonVariants } from "@repo/ui/button";
import { useSession } from "next-auth/react";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import WalletActions from "./components/WalletActions";
import { Payment } from "@repo/db";
import { getOrganizationPayments, unlinkWallet } from "./_actions";
import { useWalletProvider } from "@/providers/walletContextProvider";
import { useSearchParams } from "next/navigation";
import TransactionsTable from "./components/transactionsTable";
import Link from "next/link";
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
          <Button onClick={() => setWalletActionState(true)}>
            Add Funds / Wallet Actions
          </Button>

          {session.data.organization.publicKey && (
            <Button
              onClick={async () => {
                await unlinkWallet();
                session.update({ ...session.data });
              }}
              variant={"outline"}
              className="border-red-500 text-red-500 hover:text-white hover:bg-red-500 duration-300"
            >
              Unlink wallet
            </Button>
          )}
        </div>
      </div>

      <TransactionsTable pastPayments={pastPayments} pageNo={pageNo} />
      {pastPayments.length === 0 && (
        <div className="flex flex-col gap-6  py-12 items-center">
          <h1 className="text-xl font-bold text-muted-foreground  ">
            You don&apos;t have any payments. Please create one.
          </h1>
          <Link
            href={
              "https://jashandeep.notion.site/Docs-of-GitSol-8ba6ea37503a46829caecfe54bc3f637"
            }
            className={cn(buttonVariants())}
          >
            Check Docs
          </Link>
        </div>
      )}
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
