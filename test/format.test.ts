import { describe, it, expect } from "vitest";
import { asAddress, formatTokenAmount, parseAmountInput, shortAddress } from "../src/lib/format";

describe("formatTokenAmount", () => {
  it("adds thousands separators", () => {
    expect(formatTokenAmount(1234567n * 10n ** 18n, 18)).toBe("1,234,567");
  });

  it("trims trailing zeros and long fractions", () => {
    expect(formatTokenAmount(1_500_000_000_000_000_000n, 18)).toBe("1.5");
    expect(formatTokenAmount(1_234_567_890_123_456_789n, 18)).toBe("1.2345");
  });

  it("handles zero and tokens with other decimals", () => {
    expect(formatTokenAmount(0n, 18)).toBe("0");
    expect(formatTokenAmount(2_500_000n, 6)).toBe("2.5");
  });

  it("shows sub-precision dust as zero rather than a long fraction", () => {
    expect(formatTokenAmount(1n, 18)).toBe("0");
  });
});

describe("parseAmountInput", () => {
  it("parses whole and decimal amounts", () => {
    expect(parseAmountInput("1", 18)).toBe(10n ** 18n);
    expect(parseAmountInput("0.5", 6)).toBe(500_000n);
    expect(parseAmountInput(" 2.25 ", 2)).toBe(225n);
  });

  it("returns null for half-typed or invalid input", () => {
    for (const bad of ["", ".", "abc", "1.2.3", "-1", "1e5"]) {
      expect(parseAmountInput(bad, 18)).toBeNull();
    }
  });

  it("rejects more fractional digits than the token supports", () => {
    expect(parseAmountInput("0.1234567", 6)).toBeNull();
    expect(parseAmountInput("0.123456", 6)).toBe(123_456n);
  });

  it("accepts a trailing dot while typing", () => {
    expect(parseAmountInput("1.", 18)).toBe(10n ** 18n);
  });
});

describe("addresses", () => {
  it("shortens", () => {
    expect(shortAddress("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")).toBe("0xf39F…2266");
  });

  it("validates", () => {
    expect(asAddress("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")).not.toBeNull();
    expect(asAddress("0x123")).toBeNull();
  });
});
