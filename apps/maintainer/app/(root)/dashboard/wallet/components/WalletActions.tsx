"use client";
import { Button } from "@repo/ui/button";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Session } from "next-auth";
import React, { useEffect, useState } from "react";
import SignMessge from "./signMessage";
import { Input } from "@repo/ui/input";
import {
  verifyUserBasicAuth,
  verifyUserBasicAuthAndBasicOrganizationValidation,
  verifyUserBasicAuthAndProperOrganization,
} from "@/lib/authentication";
import AddFunds from "./addFunds";
import { X } from "lucide-react";

export type IWalletState =
  | null
  | "need_wallet_connection"
  | "need_to_sign_message"
  | "transfer_funds";
const WalletActions = ({
  session,
  walletActionState,
  setWalletActionState,
}: {
  session: Session;
  setWalletActionState: React.Dispatch<React.SetStateAction<boolean>>;
  walletActionState: boolean;
}) => {
  const [currentState, setcurrentState] = useState<IWalletState>(null);
  const { publicKey } = useWallet();
  const newSession = verifyUserBasicAuthAndProperOrganization(session);
  useEffect(() => {
    if (newSession) {
      setcurrentState("transfer_funds");
    } else if (publicKey) {
      setcurrentState("need_to_sign_message");
    } else if (!publicKey) {
      setcurrentState("need_wallet_connection");
    }
  }, [publicKey, newSession]);
  if (!walletActionState) return null;

  return (
    <div className="bg-white absolute top-0 left-0 h-screen w-screen z-10 min-h-screen flex flex-col justify-center">
      <button
        className="fixed top-5 left-5 z-10 border rounded-full p-3 hover:border-black duration-300 hover:rotate-180 "
        onClick={() => setWalletActionState(false)}
      >
        <X size={20} />
      </button>
      {currentState === "need_wallet_connection" ? (
        <div className="flex flex-col items-center">
          <h1 className="lg:text-3xl font-bold">Connect Wallet</h1>
          <p className="text-sm text-muted-foreground">
            Connect wallet to deposite the money.
          </p>
          <div className="mt-4">
            <WalletMultiButton />
          </div>
        </div>
      ) : null}

      {currentState === "need_to_sign_message" ? <SignMessge /> : null}
      {currentState === "transfer_funds" && newSession ? (
        <AddFunds session={newSession} />
      ) : null}
    </div>
  );
};

export default WalletActions;
