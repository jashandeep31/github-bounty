"use client";
import {
  IVerifyUserBasicAuthAndBasicOrganizationValidation,
  verifyUserBasicAuthAndBasicOrganizationValidation,
} from "@/lib/authentication";
import { useWalletProvider } from "@/providers/walletContextProvider";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const NavbarMessageComponent = () => {
  const _session = useSession();
  const [session, setSession] =
    useState<null | IVerifyUserBasicAuthAndBasicOrganizationValidation>(null);
  const wallet = useWalletProvider();

  useEffect(() => {
    if (_session.data && _session.status === "authenticated") {
      setSession(
        verifyUserBasicAuthAndBasicOrganizationValidation(_session.data)
      );
    }
  }, [_session]);

  // TODO: Messages are not clear / robust eoungh need to change out the states of it.
  return (
    <div className="">
      {!session?.organization?.publicKey ? (
        <div className="bg-blue-500 text-white text-center p-1">
          <p>
            Please link you{" "}
            <Link className="underline" href={"/dashboard/wallet"}>
              Wallet
            </Link>
          </p>
        </div>
      ) : null}
      {wallet.state === "connected" && wallet.amount < 10 ? (
        <div className="bg-blue-500 text-white text-center p-1">
          <p>
            Please top up your{" "}
            <Link className="underline" href={"/dashboard/wallet"}>
              Wallet
            </Link>
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default NavbarMessageComponent;
