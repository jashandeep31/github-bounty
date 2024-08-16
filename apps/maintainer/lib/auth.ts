import NextAuth, { Session, User } from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./db";
import { Organization } from "@repo/db";

// declare module "next-auth" {
//   interface Session {
//     user: User & {
//       /** The user's postal address. */
//       accessToken: string;
//     };
//     organization: Organization;
//   }
// }

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name ?? profile.login,
          email: profile.email,
          image: profile.avatar_url,
          username: profile.login,
          emailVerified: null,
        };
      },
    }),
  ],
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      const newSession = {
        ...session,
        user: {
          ...session.user,
          username: token.username as string,
          accessToken: token.accessToken as string,
        },
        organization: token.organization,
      };
      return newSession as Session;
    },
    async jwt({ token, user, account }) {
      // If there's an account object, store the access token in the JWT token
      if (user) {
        token.username = user?.username;
      }
      if (account) {
        token.accessToken = account.access_token;
      }

      if (user) {
        // Check if an organization exists for the user
        const isOrganization = await db.organization.findFirst({
          where: {
            userId: user?.id ?? "", // Default to an empty string if user.id is not available
          },
        });
        // If the organization does not exist
        if (!isOrganization) {
          // Fetch the user from the database
          const dbUser = await db.user.findUnique({
            where: {
              id: user.id,
            },
          });

          // If the user does not exist or doesn't have an email, return the token as is
          if (!dbUser || !dbUser.email) return token;

          // Create a new organization in the database
          const organization = await db.organization.create({
            data: {
              name: dbUser.username,
              image: dbUser.image ?? "", // Default to an empty string if image is not available
              email: dbUser.email,
              balance: 0,
              userId: dbUser.id,
              allowedDispancers: [user.username],
            },
          });

          // Store the new organization ID in the token
          token.organization = organization;
          token.organization = organization;
          console.log(token);
          return token;
        } else {
          token.organization = isOrganization;
          return token;
        }
      }
      return token;
    },
  },
});
