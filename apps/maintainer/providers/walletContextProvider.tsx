"use client";
import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { getOrganizationWalletAmount } from "./_actions";

type IWallet =
  | {
      state: "loading";
      amount: null;
    }
  | {
      state: null;
      amount: null;
    }
  | {
      state: "connected";
      amount: number;
    };

export const WalletContext = createContext<IWallet>({
  state: "loading",
  amount: null,
});

export function WalletContextProvider({ children }: { children: ReactNode }) {
  const [walletAmount, setWalletAmount] = useState<IWallet>({
    state: "loading",
    amount: null,
  });
  const updateWallet = async () => {
    const res = await getOrganizationWalletAmount();
    if (!res)
      setWalletAmount({
        state: null,
        amount: null,
      });

    if (res) {
      setWalletAmount({
        state: "connected",
        amount: res,
      });
    }
  };
  useEffect(() => {
    updateWallet();
  }, []);

  return (
    <WalletContext.Provider value={walletAmount}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWalletProvider = () => useContext(WalletContext);
