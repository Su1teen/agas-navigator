import { create } from "zustand";

export type Lang = "en" | "ru";
export type Currency = "USD" | "KZT";

export const FX_RATE = 480;

type AppState = {
  lang: Lang;
  currency: Currency;
  setLang: (l: Lang) => void;
  setCurrency: (c: Currency) => void;
};

export const useApp = create<AppState>((set) => ({
  lang: "en",
  currency: "USD",
  setLang: (lang) => set({ lang }),
  setCurrency: (currency) => set({ currency }),
}));

export function convert(usd: number, currency: Currency) {
  return currency === "USD" ? usd : usd * FX_RATE;
}

export function formatMoney(usd: number, currency: Currency, opts?: { compact?: boolean }) {
  const value = convert(usd, currency);
  const symbol = currency === "USD" ? "$" : "₸";
  if (opts?.compact) {
    const abs = Math.abs(value);
    const fmt = (n: number, s: string) => `${symbol}${Number(n.toFixed(1))}${s}`;
    if (abs >= 1_000_000_000) return fmt(value / 1_000_000_000, "B");
    if (abs >= 1_000_000) return fmt(value / 1_000_000, "M");
    if (abs >= 1_000) return fmt(value / 1_000, "K");
  }
  const decimals = currency === "USD" ? 2 : 0;
  return `${symbol}${value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}