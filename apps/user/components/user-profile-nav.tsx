import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import React from "react";

const UserProfile = ({ session }: { session: Session }) => {
  return (
    <div>
      {" "}
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Image
            src={session.user.image ?? ""}
            alt="image"
            className="w-8 h-8 rounded-full border "
            width={100}
            height={100}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              {session.user.name && (
                <p className="font-medium">{session.user.name}</p>
              )}
              {session.user.email && (
                <p className="w-[200px] truncate text-sm text-muted-foreground">
                  {session.user.email}
                </p>
              )}
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/dashboard">Dashboard</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/wallet">Wallet</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/bounties">All Bounites</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={(event) => {
              event.preventDefault();
              signOut({
                callbackUrl: `${window.location.origin}/login`,
              });
            }}
          >
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserProfile;
