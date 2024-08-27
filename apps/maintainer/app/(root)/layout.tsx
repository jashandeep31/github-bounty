import React from "react";
import Navbar from "@/components/navbar";
import NavbarMessageComponent from "@/components/navbar-message";
import Link from "next/link";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen justify-between">
      <header className="sticky top-0 z-10">
        <Navbar />
      </header>
      <NavbarMessageComponent />

      <main className="grid flex-1">{children}</main>
      <footer className=" py-4 border-t mt-12">
        <div className="container flex flex-wrap gap-3">
          <p>@Jashandeep31</p>
          <p>
            Read docs to work{" "}
            <Link
              href={
                "https://jashandeep.notion.site/Docs-of-GitSol-8ba6ea37503a46829caecfe54bc3f637"
              }
            >
              Docs
            </Link>{" "}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default layout;
