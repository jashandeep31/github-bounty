import { clusterApiUrl, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";

// !!
// TODO this file need major update;
export const DOLLAR_TO_SOL: number = 0.005178529815385412;
export const DOLLAR_TO_INR: number = 83;
export const MY_PUBLIC_KEY: string = `BBaeWHi8rhCAVHt24Wzp6bdQgfEds2hQon45cjrXvTLs`;

export const sol3Connection = new Connection(
  clusterApiUrl("devnet"),
  "confirmed"
);

export const convertToValidLamports = (amount: number): number => {
  const scaledAmount = Math.round(amount * LAMPORTS_PER_SOL);
  return scaledAmount;
};

export const convertDollarToSOL = (dollar: number): number => {
  return convertToValidLamports(dollar * DOLLAR_TO_SOL) / LAMPORTS_PER_SOL;
};

export const convertLamportsToSOL = (lamports: number): number => {
  return lamports / LAMPORTS_PER_SOL;
};

export const convertSOLTODollar = (sol: number) => {
  const dollar = (Math.floor(sol / DOLLAR_TO_SOL) * 100) / 100;
  return dollar;
};
