"use client";
import { buttonVariants } from "@repo/ui/button";
import { cn } from "@repo/ui/utils";
import { useSession } from "next-auth/react";
import Link from "next/link";
import UserProfile from "./user-profile-nav";
import { usePathname } from "next/navigation";
import { Moon, Sun, Wallet } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown";

const navbarDesktopLinks: { name: string; link: string; newTab: boolean }[] = [
  { name: "Home", link: "/", newTab: false },
  { name: "All Bounties", link: "/bounties", newTab: false },
  { name: "Explore Projects", link: "/projects", newTab: false },
  {
    name: "Docs",
    link: "https://jashandeep.notion.site/Docs-of-GitSol-8ba6ea37503a46829caecfe54bc3f637",
    newTab: true,
  },
  { name: "Wallet", link: "/wallet", newTab: false },
];

export default function Navbar() {
  const session = useSession();
  const pathname = usePathname();

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
    <div className="py-3">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-6 ">
          <h1 className="text-lg font-bold">GitSol</h1>
          <div className="flex gap-4 items-center">
            {navbarDesktopLinks.map((link, index) => (
              <nav
                key={index}
                className={`text-sm ${pathname === link.link ? "text-foreground underline" : "text-muted-foreground"} font-medium hover:text-foreground duration-300`}
              >
                <Link
                  href={link.link}
                  target={link.newTab ? "_blank" : "_self"}
                >
                  {link.name}
                </Link>
              </nav>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Toggler />

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
