import React from "react";
import Navbar from "@/components/navbar";
import NavbarMessageComponent from "@/components/navbar-message";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen justify-between">
      <header className="sticky top-0 z-10">
        <Navbar />
      </header>
      <NavbarMessageComponent />

      <main className="grid flex-1">{children}</main>
      <footer className=" py-4 border-t mt-12">
        <div className="container">
          <p>@Jashandeep31</p>
        </div>
      </footer>
    </div>
  );
};

export default layout;
