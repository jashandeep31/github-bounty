import NextAuth, { Session } from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./db";

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
          publicKey: token.publicKey as string,
        },
      };
      return newSession as Session;
    },
    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        token.username = user?.username;
        const dbUser = await db.user.findUnique({
          where: { username: user.username },
        });
        if (dbUser) {
          token.publicKey = dbUser.publicKey;
        }
      }
      if (trigger === "update" && session) {
        token.username = session.user.username;
        const dbUser = await db.user.findUnique({
          where: { username: session.user.username },
        });
        if (dbUser) {
          token.publicKey = dbUser.publicKey;
        }
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
});
