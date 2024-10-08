"use client";
import { buttonVariants } from "@repo/ui/button";
import { cn } from "@repo/ui/utils";
import { useSession } from "next-auth/react";
import Link from "next/link";
import UserProfile from "./user-profile-nav";

import { Moon, Sun, Wallet } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown";
import { useWalletProvider } from "@/providers/walletContextProvider";

const navbarDesktopLinks: { name: string; link: string; newTab: boolean }[] = [
  { name: "Home", link: "/", newTab: false },
  {
    name: "Docs",
    link: "https://jashandeep.notion.site/Docs-of-GitSol-8ba6ea37503a46829caecfe54bc3f637",
    newTab: true,
  },
  { name: "Payouts", link: "/dashboard/payouts", newTab: false },
  { name: "Wallet", link: "/dashboard/wallet", newTab: false },
];

export default function Navbar() {
  const session = useSession();
  const wallet = useWalletProvider();
  const { setTheme } = useTheme();

  const Toggler = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-none" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="py-3 bg-background ">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-6 ">
          <Link href={"/"} className="text-lg font-bold flex flex-col ">
            GitSol <span className="text-xs font-light">Maintainers</span>
          </Link>
          <div className="hidden md:flex gap-4 items-center">
            {navbarDesktopLinks.map((link, index) => (
              <nav
                key={index}
                className="text-sm text-muted-foreground font-medium hover:text-foreground duration-300"
              >
                <Link
                  target={link.newTab ? "_blank" : "_self"}
                  href={link.link}
                >
                  {link.name}
                </Link>
              </nav>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Toggler />
          {session.status === "unauthenticated" && (
            <Link
              href={"/login"}
              className={cn(
                buttonVariants({ size: "sm", variant: "outline" }),
                "rounded-full"
              )}
            >
              Login
            </Link>
          )}

          {wallet.state === "connected" && (
            <Link href={"/dashboard/wallet"}>
              <span className="border border-muted rounded  px-3 py-1 text-sm flex items-center gap-1">
                <Wallet size={16} /> ${wallet.amount}
              </span>
            </Link>
          )}
          {session.status === "authenticated" && (
            <UserProfile session={session.data} />
          )}
        </div>
      </div>
    </div>
  );
}
