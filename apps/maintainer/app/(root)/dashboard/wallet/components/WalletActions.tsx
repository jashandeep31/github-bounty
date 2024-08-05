"use client";
import { Button } from "@repo/ui/button";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Session } from "next-auth";
import React, { useEffect, useState } from "react";
import SignMessge from "./signMessage";
import {
  verifyUserBasicAuth,
  verifyUserBasicAuthAndBasicOrganizationValidation,
} from "@/lib/authentication";

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
  useEffect(() => {
    if (!publicKey) {
      setcurrentState("need_wallet_connection");
    } else {
      setcurrentState("need_to_sign_message");
    }
  }, [publicKey]);
  if (!walletActionState) return null;

  return (
    <div className="bg-white absolute top-0 left-0 h-screen w-screen z-10 min-h-screen flex flex-col justify-center">
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
    </div>
  );
};

export default WalletActions;
