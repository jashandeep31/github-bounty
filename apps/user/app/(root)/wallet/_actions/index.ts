"use server";

import { auth } from "@/lib/auth";
import { verifyUserBasicAuth } from "@/lib/authenticate";
import nacl from "tweetnacl";
import { decodeUTF8 } from "tweetnacl-util";
import bs58 from "bs58";
import { PublicKey } from "@solana/web3.js";
import { db } from "@/lib/db";
export async function verifyMessageAndUpdatePublicKey({
  signature,
  publicKey,
  message,
}: {
  signature: string;
  publicKey: string;
  message: string;
}) {
  try {
    const _session = await auth();
    const session = _session ? verifyUserBasicAuth(_session) : null;
    if (!session) throw new Error("Authentication failed");
    const isValid = nacl.sign.detached.verify(
      decodeUTF8(message),
      bs58.decode(signature),
      new PublicKey(publicKey).toBytes()
    );
    if (!isValid) throw new Error("Not valid signature");
    await db.user.update({
      where: {
        username: session.user.username,
      },
      data: {
        publicKey,
      },
    });
  } catch (e: any) {
    throw new Error(e?.message || "Something went wrong");
  }
}

export const removeWallet = async (): Promise<{
  message: string;
  status: number;
}> => {
  try {
    const _session = await auth();
    const session = _session ? verifyUserBasicAuth(_session) : null;
    if (!session) throw new Error("Authentication failed");
    await db.user.update({
      where: {
        username: session.user.username,
      },
      data: {
        publicKey: null,
      },
    });
    return {
      message: "Unlink successfull",
      status: 200,
    };
  } catch (error) {
    return {
      message: "Something went wrong",
      status: 500,
    };
  }
};
