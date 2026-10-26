import { isAddress, zeroAddress, type Address } from "viem";

export type ChainName = "foundry" | "sepolia" | "mainnet";

const CHAIN_NAMES: ChainName[] = ["foundry", "sepolia", "mainnet"];

export interface AppEnv {
  chain: ChainName;
  tokenAddress: Address;
  rpcUrl: string | undefined;
}

/** Takes the raw env so it can be unit tested. NEXT_PUBLIC_* vars must be read statically in Next, see src/wagmi.ts. */
export function parseEnv(raw: { chain?: string; tokenAddress?: string; rpcUrl?: string }): AppEnv {
  const chain = (raw.chain || "foundry") as ChainName;
  if (!CHAIN_NAMES.includes(chain)) {
    throw new Error(`NEXT_PUBLIC_CHAIN must be one of ${CHAIN_NAMES.join(", ")}, got "${raw.chain}"`);
  }

  const tokenAddress = raw.tokenAddress || zeroAddress;
  if (!isAddress(tokenAddress)) {
    throw new Error(`NEXT_PUBLIC_TOKEN_ADDRESS is not a valid address: "${raw.tokenAddress}"`);
  }

  return { chain, tokenAddress, rpcUrl: raw.rpcUrl || undefined };
}
