"use client";
import { auth } from "@/lib/auth";
import { Button } from "@repo/ui/button";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const Page = () => {
  const session = useSession();

  return (
    <div className="container min-h-screen flex items-center justify-center">
      <div className="border rounded-md p-3 lg:w-1/3">
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="text-muted-foreground">
          {" "}
          Please select your github account to continue.
        </p>
        <div className="my-6">
          <Button
            variant={"outline"}
            className="w-full"
            onClick={() => {
              signIn("github");
            }}
          >
            Github
          </Button>
        </div>
        <div className="flex justify-between gap-3 flex-wrap">
          <Link
            href={"/"}
            className="hover:underline duration-300 text-muted-foreground hover:text-foreground"
          >
            Sign Up?
          </Link>
          <Link
            href={"/"}
            className="hover:underline duration-300 text-muted-foreground hover:text-foreground"
          >
            Login as maintainer?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
