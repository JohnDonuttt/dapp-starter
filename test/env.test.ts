import { describe, it, expect } from "vitest";
import { zeroAddress } from "viem";
import { parseEnv } from "../src/lib/env";

describe("parseEnv", () => {
  it("defaults to the local chain with no token configured", () => {
    expect(parseEnv({})).toEqual({ chain: "foundry", tokenAddress: zeroAddress, rpcUrl: undefined });
  });

  it("accepts a valid config", () => {
    const env = parseEnv({
      chain: "sepolia",
      tokenAddress: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      rpcUrl: "https://rpc.example",
    });
    expect(env.chain).toBe("sepolia");
    expect(env.rpcUrl).toBe("https://rpc.example");
  });

  it("treats an empty rpc url as unset", () => {
    expect(parseEnv({ rpcUrl: "" }).rpcUrl).toBeUndefined();
  });

  it("throws a readable error for a bad chain or address", () => {
    expect(() => parseEnv({ chain: "goerli" })).toThrow(/NEXT_PUBLIC_CHAIN/);
    expect(() => parseEnv({ tokenAddress: "0x123" })).toThrow(/NEXT_PUBLIC_TOKEN_ADDRESS/);
  });
});
