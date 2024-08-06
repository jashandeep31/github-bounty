import { User as IUser } from "next-auth";
import { Organization } from "@repo/db";

declare module "next-auth" {
  interface Session {
    user: {
      accessToken: string;
      username: string;
    } & IUser;
    organization: Organization;
  }
  interface User extends IUser {
    username: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    username: string;
  }
}
