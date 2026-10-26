import { cookieStorage, createConfig, createStorage, http, injected } from "wagmi";
import { foundry, mainnet, sepolia } from "wagmi/chains";
import { parseEnv } from "@/lib/env";

// Next only inlines NEXT_PUBLIC_* when they're referenced like this, not via process.env[name]
export const env = parseEnv({
  chain: process.env.NEXT_PUBLIC_CHAIN,
  tokenAddress: process.env.NEXT_PUBLIC_TOKEN_ADDRESS,
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL,
});

const chains = { foundry, sepolia, mainnet } as const;
export const activeChain = chains[env.chain];

export function getConfig() {
  return createConfig({
    chains: [activeChain],
    connectors: [injected()],
    ssr: true,
    // cookie storage lets the server render the right connection state, avoiding a hydration flash
    storage: createStorage({ storage: cookieStorage }),
    transports: { [activeChain.id]: http(env.rpcUrl) } as Record<number, ReturnType<typeof http>>,
  });
}

declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}
