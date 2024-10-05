import { IVerifyUserBasicAuthAndProperOrganization } from "@/lib/authentication";
import React, { useCallback, useState } from "react";
import { Input } from "@repo/ui/input";
import { Button } from "@repo/ui/button";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { PublicKey, Transaction } from "@solana/web3.js";

import { toast } from "sonner";
import { verifyPaymentAndUpdateOrganizationWallet } from "../_actions";
import {
  createTransferInstruction,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from "@solana/spl-token";

const AddFunds = ({
  session,
  setWalletActionState,
}: {
  session: IVerifyUserBasicAuthAndProperOrganization;
  setWalletActionState: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { connection } = useConnection();
  const [amount, setAmount] = useState<number>(5);
  const { publicKey, sendTransaction } = useWallet();

  const generateTransaction = useCallback(async () => {
    const toastId = toast.loading("Proccessing payment");

    try {
      if (amount < 5) {
        throw new Error(`Amount must be $5 or more `);
      }
      if (!publicKey)
        throw new Error(
          "Unable to load public key, Please reconnect the wallet"
        );

      const {
        context: { slot: minContextSlot },
        value: { blockhash, lastValidBlockHeight },
      } = await connection.getLatestBlockhashAndContext();

      const MINT_ADDRESS = new PublicKey(
        process.env.NEXT_PUBLIC_MINT_ADDRESS || ""
      );
      async function getNumberDecimals(
        mintAddress: PublicKey
      ): Promise<number> {
        const info = await connection.getParsedAccountInfo(mintAddress);
        const result = (info.value?.data as any).parsed.info.decimals as number;
        console.log(result);
        return result;
      }
      await getNumberDecimals(MINT_ADDRESS);
      const toPublicKey = new PublicKey(
        process.env.NEXT_PUBLIC_WALLET_PUBLIC_ADDRESS || ""
      );
      const fromTokenAccountAddress = await getAssociatedTokenAddress(
        MINT_ADDRESS,
        publicKey,
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );
      const toTokenAccountAddress = await getAssociatedTokenAddress(
        MINT_ADDRESS,
        toPublicKey,
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );
      const transaction = new Transaction().add(
        createTransferInstruction(
          fromTokenAccountAddress,
          toTokenAccountAddress,
          publicKey,
          1000_000 * amount,
          [],
          TOKEN_PROGRAM_ID
        )
      );

      const signature = await sendTransaction(transaction, connection, {
        minContextSlot,
      });

      const confirmation = await connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature,
      });
      await verifyPaymentAndUpdateOrganizationWallet({
        blockhash,
        lastValidBlockHeight,
        signature,
      });
      toast.success("Payment successfull", { id: toastId });
      setWalletActionState(false);
      // ! Temp solution to effect the updated balance
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong", { id: toastId });
    }
  }, [amount, publicKey, connection, sendTransaction, setWalletActionState]);
  return (
    <div className="flex flex-col items-center">
      <h1 className="lg:text-3xl font-bold">Add Funds</h1>
      <p className="text-sm text-muted-foreground">
        Enter the amount in USDT and then click on pay.
      </p>
      <p className="text-sm text-muted-foreground">
        Make sure to pay using {session?.organization.publicKey.slice(0, 4)}
        ... wallet
      </p>
      <div className=" mt-4 flex flex-col gap-3 items-center">
        <Input
          value={amount}
          onChange={(e) => setAmount(parseInt(e.target.value))}
          type="number"
          placeholder="100"
        />
        <Button onClick={generateTransaction}>Pay Now</Button>
      </div>
    </div>
  );
};

export default AddFunds;
