import { auth } from "@/lib/auth";
import { Button, buttonVariants } from "@repo/ui/button";
import { cn } from "@repo/ui/utils";
import Link from "next/link";

const navbarDesktopLinks: { name: string; link: string }[] = [
  { name: "Home", link: "/" },
  { name: "Payouts", link: "/dashboard/payouts" },
  { name: "Wallet", link: "/dashboard/wallet" },
  { name: "About Us", link: "/about" },
];

export default async function Navbar() {
  const session = await auth();
  return (
    <div className="py-3">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-6 ">
          <h1 className="text-lg font-bold flex flex-col ">
            GitSol <span className="text-xs font-light">Maintainers</span>{" "}
          </h1>
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
          {!session?.user || !session.organization ? (
            <Link
              href={"/login"}
              className={cn(
                buttonVariants({ size: "sm", variant: "outline" }),
                "rounded-full"
              )}
            >
              Login
            </Link>
          ) : (
            <Link href={"/dashboard/wallet"}>
              <span className="border rounded  px-3 py-1 border-foreground text-sm">
                USDT {session.organization.balance}
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
