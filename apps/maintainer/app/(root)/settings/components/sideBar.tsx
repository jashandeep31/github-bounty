"use client";
import { buttonVariants } from "@repo/ui/button";
import { cn } from "@repo/ui/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const SideBar = () => {
  const pathname = usePathname();
  const links = [
    {
      name: "Manage Access",
      href: "/settings/manage-access",
    },
  ];
  return (
    <div className="space-y-2">
      {links.map((link, index) => (
        <Link
          href={link.href}
          key={index}
          className={`block p-2 hover:bg-muted duration-300 rounded-md font-medium text-sm  ${pathname === link.href ? "bg-muted" : ""}`}
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
};

export default SideBar;
