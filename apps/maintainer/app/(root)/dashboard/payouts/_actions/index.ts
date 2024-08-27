"use server";
import { auth } from "@/lib/auth";
import { verifyUserBasicAuthAndBasicOrganizationValidation } from "@/lib/authentication";
import { db } from "@/lib/db";

export async function moveFailedToUnCollected(id: string): Promise<{
  status: number;
  message: string;
}> {
  try {
    const _session = await auth();
    const session = _session
      ? verifyUserBasicAuthAndBasicOrganizationValidation(_session)
      : null;
    if (!session) throw new Error("Authentication failed");

    const payout = await db.payout.findUnique({
      where: {
        id: id,
        organizationId: session.organization.id,
      },
    });
    if (!payout) throw new Error("Payout not found");

    if (payout.status !== "FAILED") throw new Error("Payout is not failed");
    await db.payout.update({
      where: { id: id },
      data: {
        status: "UNCOLLECTED",
      },
    });

    return {
      status: 200,
      message: "Moved failed payout to uncollected",
    };
  } catch (error: any) {
    return {
      status: 500,
      message: error.message ? error.message : "Internal server error",
    };
  }
}
