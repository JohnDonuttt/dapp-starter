import { describe, it, expect } from "vitest";
import { getErrorMessage } from "../src/lib/errors";

describe("getErrorMessage", () => {
  it("returns empty for no error", () => {
    expect(getErrorMessage(null)).toBe("");
  });

  it("recognises a rejected signature", () => {
    expect(getErrorMessage({ name: "UserRejectedRequestError", shortMessage: "User rejected the request." })).toBe(
      "Transaction rejected in wallet.",
    );
  });

  it("extracts a revert reason", () => {
    const err = { shortMessage: 'The contract function "transfer" reverted with the following reason:\nERC20: insufficient balance' };
    expect(getErrorMessage(err)).toBe("Reverted: ERC20: insufficient balance");
  });

  it("falls back to the short message, then the first line of message", () => {
    expect(getErrorMessage({ shortMessage: "Chain mismatch" })).toBe("Chain mismatch");
    expect(getErrorMessage({ message: "first\nsecond" })).toBe("first");
  });
});
