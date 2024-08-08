"use server";

import { auth } from "@/lib/auth";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { decodeUTF8 } from "tweetnacl-util";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { db } from "@/lib/db";
import {
  verifyUserBasicAuthAndBasicOrganizationValidation,
  verifyUserBasicAuthAndProperOrganization,
} from "@/lib/authentication";
import {
  convertLamportsToSOL,
  convertSOLTODollar,
  sol3Connection,
} from "@/lib/sol3";
import { Payment } from "@repo/db";

export const verifyMessageAndUpdatePublicKey = async ({
  signature,
  publicKey,
  message,
}: {
  signature: string;
  publicKey: string;
  message: string;
}) => {
  try {
    const session = await auth();
    if (!session?.user || !session.user.email)
      throw new Error("Authentication failed");
    if (!session.organization)
      throw new Error("Organization account not found");

    const isValid = nacl.sign.detached.verify(
      decodeUTF8(message),
      bs58.decode(signature),
      new PublicKey(publicKey).toBytes()
    );
    if (!isValid) throw new Error("Not valid signature");
    await db.organization.update({
      where: {
        id: session.organization.id,
      },
      data: {
        publicKey: publicKey,
      },
    });
  } catch (e: any) {
    throw new Error(e?.message || "Something went wrong");
  }
};
export async function verifyPaymentAndUpdateOrganizationWallet({
  blockhash,
  lastValidBlockHeight,
  signature,
}: {
  blockhash: string;
  lastValidBlockHeight: number;
  signature: string;
}) {
  try {
    const _session = await auth();
    if (!_session) throw new Error("Authentication failed");
    const session = verifyUserBasicAuthAndProperOrganization(_session);
    if (!session) throw new Error("Authentication failed");
    const transaction = await sol3Connection.getTransaction(signature, {
      maxSupportedTransactionVersion: 1,
    });

    if (!transaction) {
      throw new Error(
        "Failed to validate the signature, submit signature throught form"
      );
    }
    await db.$transaction(async (tx) => {
      const paymentAmount =
        Math.floor(
          convertSOLTODollar(
            convertLamportsToSOL(
              (transaction?.meta?.postBalances[1] ?? 0) -
                (transaction?.meta?.preBalances[1] ?? 0)
            )
          ) * 100
        ) / 100;

      if (paymentAmount <= 0 || !paymentAmount)
        throw new Error(`Payment amount is not valid`);

      const organization = await tx.organization.update({
        where: { id: session.organization.id },
        data: {
          balance: {
            increment: paymentAmount,
          },
        },
      });
      if (!organization) throw new Error("failed to load user");
      const user = await tx.user.findUnique({
        where: { email: session.user.email },
      });
      if (!user) throw new Error("failed to load organization");

      // create a payment
      const payment = await tx.payment.create({
        data: {
          organizationId: organization.id,
          initialAmount: paymentAmount,
          charges: 0,
          transferredAmount: paymentAmount,
          signature: signature,
          paidToCompany: true,
          body: `Paid by ${user.username} to the company wallet amount `,
          refund: false,
        },
      });
      //create a wallet transaction
      const lastWalletTransaction = await tx.walletTransaction.findFirst({
        where: {
          organizationId: organization.id,
        },
        orderBy: {
          createdAt: "desc", // Assuming you have a createdAt field to sort by
        },
      });
      let initialAmount = 0;
      if (lastWalletTransaction) {
        initialAmount = lastWalletTransaction.totalWalletAmount;
      }
      const walletTransaction = await tx.walletTransaction.create({
        data: {
          type: "CREDIT",
          organizationId: organization.id,
          amount: paymentAmount,
          totalWalletAmount: initialAmount + paymentAmount,
          signature: signature,
          paymentId: payment.id,
          body: `Paid by ${user.username} to the company wallet amount `,
          refund: false,
        },
      });
    });
  } catch (error: any) {
    throw new Error(error?.message || "Something went wrong ");
  }
}

export async function getOrganizationPayments(): Promise<Payment[]> {
  const _session = await auth();
  if (!_session) return [];
  const session = verifyUserBasicAuthAndBasicOrganizationValidation(_session);
  if (!session) return [];

  return await db.payment.findMany({
    where: {
      organizationId: session.organization.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
