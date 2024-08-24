import { auth } from "@/lib/auth";
import { buttonVariants } from "@repo/ui/button";
import { cn } from "@repo/ui/utils";
import { redirect } from "next/navigation";
import Link from "next/link";
import React from "react";

export default async function page() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }
  return (
    <div>
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <Link
            href={""}
            className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium"
            target="_blank"
          >
            Follow along on Twitter
          </Link>
          <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-6xl">
            Dispense Your GitHub Bounties on the Solana Blockchain
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Easily dispense your bounties in USDT on the Solana blockchain
            directly from your issue/pull request.
          </p>

          <div className="space-x-4">
            <Link href="/login" className={cn(buttonVariants({ size: "lg" }))}>
              Get Started
            </Link>
            <Link
              href={""}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              GitHub
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
