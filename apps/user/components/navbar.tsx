import { auth } from "@/lib/auth";
import { verifyUserBasicAuth, verifyUserProperAuth } from "@/lib/authenticate";
import { Button, buttonVariants } from "@repo/ui/button";
import { cn } from "@repo/ui/utils";
import Link from "next/link";

const navbarDesktopLinks: { name: string; link: string }[] = [
  { name: "Home", link: "/" },
  { name: "About Us", link: "/about" },
];

export default async function Navbar() {
  const _session = await auth();
  const session = _session?.user ? verifyUserBasicAuth(_session) : null;

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
        <div>
          {!session ? (
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
          {!session?.user.publicKey ? (
            <Link
              href={"/wallet"}
              className={cn(
                buttonVariants({ size: "sm", variant: "outline" }),
                "rounded-full"
              )}
            >
              Connect Wallet
            </Link>
          ) : (
            <Link
              href={"/wallet"}
              className="border rounded-md py-1 px-2 border-black"
            >
              {session.user.publicKey.slice(0, 4)}...
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
