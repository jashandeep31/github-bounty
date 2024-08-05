"use server";

import { auth } from "@/lib/auth";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { decodeUTF8 } from "tweetnacl-util";
import { PublicKey } from "@solana/web3.js";
import { db } from "@/lib/db";

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
