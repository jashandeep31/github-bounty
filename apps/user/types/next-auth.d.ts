import { User as IUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      accessToken: string;
      username: string;
      publicKey: string;
    } & IUser;
  }
  interface User extends IUser {
    username: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    username: string;
    publicKey: string;
  }
}
