import NextAuth, { Session, User } from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./db";
import { Organization } from "@repo/db";

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
    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        token.username = user.username;
        const isOrganization = await db.organization.findFirst({
          where: {
            userId: user.id,
          },
        });
        if (isOrganization) {
          token.organization = isOrganization as Organization;
        } else if (!isOrganization) {
          const dbUser = await db.user.findUnique({
            where: {
              id: user.id,
            },
          });
          if (dbUser && dbUser.email) {
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
            token.organization = organization;
          }
        }
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      if (trigger === "update" && session) {
        const user = await db.user.findFirst({
          where: {
            email: token.email,
          },
          include: {
            Organization: true,
          },
        });
        if (!user) return token;
        token = {
          ...token,
          ...user,
          organization: user.Organization,
        };
      }

      return token;
    },
    async session({ session, token }: any) {
      console.log(token.organization.publicKey);
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
  },
});
