"use client";
import { IVerifyUserBasicAuth, verifyUserBasicAuth } from "@/lib/authenticate";
import { Button } from "@repo/ui/button";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { ed25519 } from "@noble/curves/ed25519";
import { verifyMessageAndUpdatePublicKey } from "./_actions";
import bs58 from "bs58";
import { Check } from "lucide-react";
const Page = () => {
  const _session = useSession();
  const { publicKey, signMessage } = useWallet();

  const [session, setSession] = useState<IVerifyUserBasicAuth | null>(null);

  useEffect(() => {
    setSession(
      _session.data?.user ? verifyUserBasicAuth(_session?.data) : null
    );
  }, [_session]);

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
      toast.success("Success!", { id: toastId });
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong ", { id: toastId });
    }
  }, [publicKey, signMessage]);
  if (_session.status === "loading") {
    return <h1 className="container md:mt-12 mt-6">Loading...</h1>;
  }

  return (
    <div className="container md:mt-12 mt-6">
      <h1 className="md:text-2xl text-lg font-bold">Wallet Actions</h1>
      {!publicKey ? (
        <div>
          <p>Please connect your wallet</p>
          <WalletMultiButton />
        </div>
      ) : null}
      {publicKey && !session?.user.publicKey ? (
        <div>
          <p>Verify wallet by signing message.</p>
          <div className="mt-6">
            <Button onClick={signMessageFunction}>Verify Wallet</Button>
          </div>
        </div>
      ) : null}
      {publicKey && session?.user.publicKey ? (
        <div className="">
          <div className="my-12">
            <div className="flex flex-col items-center">
              <div className="bg-green-500 rounded-full p-4 opacity-45">
                <Check size={100} className="text-background" />
              </div>
              <p className="break-all my-12 text-center">
                Congratulations your wallet is verified. You will start
                receiving your bounties soon.
                <br />
                starts with {session.user.publicKey.slice(0, 4)}.....
              </p>

              <Button
                className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white duration-300 "
                variant={"outline"}
              >
                Unlink Wallet
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Page;
