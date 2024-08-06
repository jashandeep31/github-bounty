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
const organizationBasicValidation = z.object({
  organization: z.object({
    id: z.string(),
    name: z.string(),
    image: z.string().optional().nullable(),
    email: z.string().email(),
    balance: z.number(),
    userId: z.string(),
    allowedDispancers: z.array(z.string()),
    publickKey: z.string().optional().nullable(),
  }),
});
export function verifyUserBasicAuth(
  session: Session
): null | z.infer<typeof userBasicAuthValidationSchema> {
  const parsed = userBasicAuthValidationSchema.safeParse(session);
  if (!parsed.error) {
    return parsed.data;
  }
  return null;
}
const combinedBasicSchema = z.object({
  user: userBasicAuthValidationSchema.shape.user,
  organization: organizationBasicValidation.shape.organization,
});

export function verifyUserBasicAuthAndBasicOrganizationValidation(
  session: Session
): null | z.infer<typeof combinedBasicSchema> {
  try {
    const validationResult = combinedBasicSchema.parse(session);
    return validationResult;
  } catch (error) {
    console.error("Validation failed:", error);
    return null;
  }
}

const combinedBasicSchemaWithPublicInOrg = combinedBasicSchema.extend({
  organization: combinedBasicSchema.shape.organization.extend({
    publicKey: z.string(), // publicKey is required and non-nullable
  }),
});
export type IVerifyUserBasicAuthAndProperOrganization = z.infer<
  typeof combinedBasicSchemaWithPublicInOrg
>;
export function verifyUserBasicAuthAndProperOrganization(
  session: Session
): IVerifyUserBasicAuthAndProperOrganization | null {
  try {
    const validationResult = combinedBasicSchemaWithPublicInOrg.parse(session);
    return validationResult;
  } catch (error) {
    return null;
  }
}
