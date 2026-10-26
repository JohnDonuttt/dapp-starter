import { formatUnits, parseUnits, isAddress, type Address } from "viem";

export function shortAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

/** 1234567.891 -> "1,234,567.89". Trims long fractions instead of showing 18 digits. */
export function formatTokenAmount(value: bigint, decimals: number, maxFractionDigits = 4): string {
  const [whole = "0", fraction = ""] = formatUnits(value, decimals).split(".");
  const wholeWithCommas = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const trimmed = fraction.slice(0, maxFractionDigits).replace(/0+$/, "");
  return trimmed ? `${wholeWithCommas}.${trimmed}` : wholeWithCommas;
}

/**
 * Parse what a user typed into base units. Returns null instead of throwing so the form
 * can just disable the button while the input is half-typed ("", ".", "1.").
 */
export function parseAmountInput(input: string, decimals: number): bigint | null {
  const value = input.trim();
  if (!/^\d*\.?\d*$/.test(value) || value === "" || value === ".") return null;

  const [, fraction = ""] = value.split(".");
  if (fraction.length > decimals) return null;

  try {
    return parseUnits(value, decimals);
  } catch {
    return null;
  }
}

export function asAddress(value: string): Address | null {
  return isAddress(value) ? value : null;
}
