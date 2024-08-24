"use server";

import { auth, unstable_update } from "@/lib/auth";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { decodeUTF8 } from "tweetnacl-util";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  VersionedTransactionResponse,
} from "@solana/web3.js";
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
    const { transferredAmount, receivedAmount } =
      calculateTransferredAmount(transaction);
    // if (1 == 1) return;
    if (!transaction) {
      throw new Error(
        "Failed to validate the signature, submit signature throught form"
      );
    }
    await db.$transaction(async (tx) => {
      const paymentAmount = receivedAmount / 1000_000;
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

export async function getOrganizationPayments(
  pageNo: number
): Promise<Payment[]> {
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
    skip: (pageNo - 1) * 10,
    take: 11,
  });
}

const calculateTransferredAmount = (
  transaction: VersionedTransactionResponse | null
) => {
  if (!transaction) throw new Error("Transaction is not ok");
  if (!transaction.meta) throw new Error("Transaction is not ok");
  const preTokenBalances = transaction.meta.preTokenBalances;
  const postTokenBalances = transaction.meta.postTokenBalances;

  // Assuming the token transfer involves two accounts
  if (preTokenBalances?.length !== postTokenBalances?.length) {
    throw new Error("Mismatch in token account balances length");
  }

  // Find the relevant accounts
  // this is more
  const senderBalanceBefore = preTokenBalances?.find(
    (balance) =>
      balance.accountIndex === 2 &&
      balance.mint === "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr"
  )?.uiTokenAmount.amount;
  // this is less
  const senderBalanceAfter = postTokenBalances?.find(
    (balance) =>
      balance.accountIndex === 2 &&
      balance.mint === "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr"
  )?.uiTokenAmount.amount;

  // this is less
  const receiverBalanceBefore = preTokenBalances?.find(
    (balance) =>
      balance.accountIndex === 1 &&
      balance.mint === "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr"
  )?.uiTokenAmount.amount;
  // this is more
  const receiverBalanceAfter = postTokenBalances?.find(
    (balance) =>
      balance.accountIndex === 1 &&
      balance.mint === "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr"
  )?.uiTokenAmount.amount;

  if (
    senderBalanceBefore === undefined ||
    senderBalanceAfter === undefined ||
    receiverBalanceBefore === undefined ||
    receiverBalanceAfter === undefined
  ) {
    throw new Error("Could not find token balances for sender or receiver");
  }

  // Convert string balances to numbers for calculation
  const senderBalanceBeforeNum = parseFloat(senderBalanceBefore);
  const senderBalanceAfterNum = parseFloat(senderBalanceAfter);
  const receiverBalanceBeforeNum = parseFloat(receiverBalanceBefore);
  const receiverBalanceAfterNum = parseFloat(receiverBalanceAfter);

  // Calculate the transferred amount
  const transferredAmount = senderBalanceBeforeNum - senderBalanceAfterNum;
  const receivedAmount = receiverBalanceAfterNum - receiverBalanceBeforeNum;

  return { transferredAmount, receivedAmount };
};

export async function unlinkWallet() {
  try {
    const _session = await auth();
    const session = _session
      ? verifyUserBasicAuthAndProperOrganization(_session)
      : null;
    if (!session) {
      throw new Error("Authentication not found");
    }

    const organization = await db.organization.update({
      where: {
        id: session.organization.id,
      },
      data: {
        publicKey: null,
      },
    });
    const user = await db.user.findUnique({
      where: {
        email: session.user.email,
      },
    });
    unstable_update({
      ...user,
      organization: organization,
    });
    return {
      status: 200,
      message: "Unlinked wallet successfully",
    };
  } catch (error) {
    return {
      status: 400,
      message: "Failed to unlink wallet",
    };
  }
}
