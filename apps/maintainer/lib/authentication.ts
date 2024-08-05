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
export function verifyUserBasicAuthAndProperOrganization(
  session: Session
): z.infer<typeof combinedBasicSchemaWithPublicInOrg> | null {
  try {
    const validationResult = combinedBasicSchemaWithPublicInOrg.parse(session);
    return validationResult;
  } catch (error) {
    return null;
  }
}

// {
//     "user": {
//         "name": "Jashandeep Singh",
//         "email": "jashandeep1659@gmail.com",
//         "image": "https://avatars.githubusercontent.com/u/93036882?v=4",
//         "username": "jashandeep31",
//         "accessToken": "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"
//     },
//     "expires": "2024-09-04T14:43:08.790Z",
//     "organization": {
//         "id": "57db0784-2eba-4c4f-8a83-7c808c09b3c6",
//         "name": "jashandeep31",
//         "image": "https://avatars.githubusercontent.com/u/93036882?v=4",
//         "email": "jashandeep1659@gmail.com",
//         "balance": 0,
//         "userId": "clzf98uz70004m3pe7vi94aox",
//         "allowedDispancers": [],
//         "publicKey": null,
//         "createdAt": "2024-08-04T08:03:40.213Z",
//         "updatedAt": "2024-08-04T08:03:40.213Z"
//     }
// }
