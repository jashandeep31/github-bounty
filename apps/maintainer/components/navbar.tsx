import { Button, buttonVariants } from "@repo/ui/button";
import { cn } from "@repo/ui/utils";
import Link from "next/link";

const navbarDesktopLinks: { name: string; link: string }[] = [
  { name: "Home", link: "/" },
  { name: "About Us", link: "/about" },
];

export default function Navbar() {
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
          <Link
            href={"/login"}
            className={cn(
              buttonVariants({ size: "sm", variant: "outline" }),
              "rounded-full"
            )}
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
