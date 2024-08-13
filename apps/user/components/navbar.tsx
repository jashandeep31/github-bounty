"use client";
import { Button, buttonVariants } from "@repo/ui/button";
import { cn } from "@repo/ui/utils";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import UserProfile from "./user-profile-nav";

const navbarDesktopLinks: { name: string; link: string }[] = [
  { name: "Home", link: "/" },
  { name: "Bounties", link: "/bounties" },
];

export default function Navbar() {
  const session = useSession();
  return (
    <div className="py-3">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-6 ">
          <h1 className="text-lg font-bold">GitSol</h1>
          <div className="flex gap-4 items-center">
            {navbarDesktopLinks.map((link, index) => (
              <nav
                key={index}
                className="text-sm text-muted-foreground font-medium hover:text-foreground duration-300"
              >
                <Link href={link.link}>{link.name}</Link>
              </nav>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {session.status === "unauthenticated" ? (
            <Link
              href={"/login"}
              className={cn(
                buttonVariants({ size: "sm", variant: "outline" }),
                "rounded-full"
              )}
            >
              Login
            </Link>
          ) : null}
          {!session?.data?.user.publicKey &&
          session.status === "authenticated" ? (
            <Link
              href={"/wallet"}
              className={cn(
                buttonVariants({ size: "sm", variant: "outline" }),
                "rounded-full"
              )}
            >
              Connect Wallet
            </Link>
          ) : null}

          {session.status === "authenticated" && (
            <UserProfile session={session.data} />
          )}
        </div>
      </div>
    </div>
  );
}
