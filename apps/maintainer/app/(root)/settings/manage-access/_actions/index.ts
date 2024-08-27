"use server";

import { auth } from "@/lib/auth";
import { verifyUserBasicAuthAndBasicOrganizationValidation } from "@/lib/authentication";
import { db } from "@/lib/db";

export async function updateAllowedDispancers(users: string[]) {
  try {
    const _session = await auth();
    const session = _session
      ? verifyUserBasicAuthAndBasicOrganizationValidation(_session)
      : null;
    if (!session)
      return {
        status: 401,
        message: "Unauthorized",
      };

    // validate the users
    if (!users.includes(session.user.username)) {
      return {
        status: 400,
        message: "You can't remove yourself",
      };
    }

    await db.organization.update({
      where: {
        id: session.organization.id,
      },
      data: {
        allowedDispancers: users.filter((user, index) => {
          return users.indexOf(user) === index;
        }),
      },
    });

    return {
      status: 200,
      message: "Updated",
    };
  } catch (e) {
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
}
