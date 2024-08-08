import { PublicKey } from "@solana/web3.js";
import { Session } from "next-auth";
import z from "zod";
const userBasicAuthValidationSchema = z.object({
  user: z.object({
    name: z.string(),
    email: z.string().email(),
    image: z.string().optional().nullable(),
    username: z.string(),
    accessToken: z.string(),
    publicKey: z.string().optional().nullable(),
  }),
});

export type IVerifyUserBasicAuth = z.infer<
  typeof userBasicAuthValidationSchema
>;
export function verifyUserBasicAuth(
  session: Session
): null | z.infer<typeof userBasicAuthValidationSchema> {
  const parsed = userBasicAuthValidationSchema.safeParse(session);
  if (!parsed.error) {
    return parsed.data;
  }
  return null;
}

const verifyUserProperAuthSchema = z.object({
  user: userBasicAuthValidationSchema.shape.user.extend({
    PublicKey: z.string(),
  }),
});

export type IVerifyUserProperAuth = z.infer<typeof verifyUserProperAuthSchema>;
export function verifyUserProperAuth(
  session: Session
): null | IVerifyUserProperAuth {
  try {
    return verifyUserProperAuth(session);
  } catch (e) {
    return null;
  }
}
