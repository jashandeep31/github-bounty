"use client";
import { Button } from "@repo/ui/button";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import WalletActions from "./components/WalletActions";

const Page = () => {
  const session = useSession();
  const [walletActionState, setWalletActionState] = useState<boolean>(true);
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
      <WalletActions
        session={session.data}
        setWalletActionState={setWalletActionState}
        walletActionState={walletActionState}
      />
      <div className="">
        <div className="border-foreground p-3 rounded-md border inline-block">
          <h2 className="md:text-4xl text-lg font-bold">
            USDT {session.data.organization.balance}{" "}
          </h2>
        </div>
        <div className="mt-6">
          <Button>Add Funds</Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
