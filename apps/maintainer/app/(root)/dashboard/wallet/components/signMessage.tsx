"use client";
import { Button } from "@repo/ui/button";
import { useWallet } from "@solana/wallet-adapter-react";
import { ed25519 } from "@noble/curves/ed25519";
import React, { useCallback } from "react";
import { toast } from "sonner";
import { verifyMessageAndUpdatePublicKey } from "../_actions";
import bs58 from "bs58";
import { useSession } from "next-auth/react";

const SignMessge = () => {
  const { publicKey, signMessage } = useWallet();
  const session = useSession();
  const signMessageFunction = useCallback(async () => {
    const toastId = toast.loading("Processing the message");
    try {
      if (!publicKey) throw new Error("Please reconnect your wallet");
      if (!signMessage)
        throw new Error("Wallet Doesn't support the sign message");
      const rawMessage = `Sign this message to continue with us.`;
      const message = new TextEncoder().encode(rawMessage);
      const signature = await signMessage(message);

      if (!ed25519.verify(signature, message, publicKey.toBytes()))
        throw new Error("Message signature invalid!");
      await verifyMessageAndUpdatePublicKey({
        signature: bs58.encode(signature),
        publicKey: publicKey.toBase58(),
        message: rawMessage,
      });
      session.update({ ...session.data });
      toast.success("Success!", { id: toastId });
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong ", { id: toastId });
    }
  }, [publicKey, signMessage, session]);
  return (
    <div className="flex flex-col items-center">
      <h1 className="lg:text-3xl font-bold">Sign Message</h1>
      <p className="text-sm text-muted-foreground">
        To verify your wallet please sign a message
      </p>
      <div className="mt-4">
        <Button onClick={signMessageFunction}>Sign Message </Button>
      </div>
    </div>
  );
};

export default SignMessge;
