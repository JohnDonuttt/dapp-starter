# dapp-starter

A small, dependency-light starter for EVM frontends: Next.js (App Router), wagmi v3, viem, and TypeScript. Click **Use this template**, point it at an ERC-20, and you have a working wallet dashboard to build on.

It is deliberately small. No UI kit, no CSS framework, no wallet modal library. You get the parts that are annoying to wire up correctly, and nothing you'll have to rip out.

## What you get

- **Wallet connection** with the injected connector (MetaMask, Rabby, Brave, etc.)
- **SSR-safe wagmi setup.** Connection state is stored in a cookie and passed to `WagmiProvider` as `initialState`, so there is no "disconnected" flash on reload
- **A working read + write example** (`TokenCard`): reads `symbol`, `decimals` and `balanceOf` in one multicall, validates input, sends a `transfer`, waits for the receipt, and refreshes the balance
- **Input handling that doesn't blow up:** `parseAmountInput` returns `null` for half-typed values like `""` or `"1."`, and rejects more decimals than the token supports
- **Readable errors:** `getErrorMessage` turns viem's long error chains into "Transaction rejected in wallet." or "Reverted: <reason>"
- **Validated config:** a bad chain name or token address fails the build with a clear message
- **Tests and CI** for the helpers, plus typecheck and production build in GitHub Actions

## Quick start

```sh
pnpm install
cp .env.example .env.local
pnpm dev
```

Then set `NEXT_PUBLIC_TOKEN_ADDRESS` in `.env.local`.

| Variable | Default | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_TOKEN_ADDRESS` | zero address | Any ERC-20 on the selected chain. Zero shows a setup hint |
| `NEXT_PUBLIC_CHAIN` | `foundry` | `foundry` (local anvil, chain 31337), `sepolia`, or `mainnet` |
| `NEXT_PUBLIC_RPC_URL` | chain default | Use your own RPC for anything beyond local dev |

### Trying it locally

```sh
anvil                       # in one terminal
# deploy any ERC-20 to it, e.g. with forge create, and put its address in .env.local
```

Import one of anvil's test accounts into your wallet and add `http://127.0.0.1:8545` (chain ID 31337) as a network.

## Making it yours

| To... | Edit |
| --- | --- |
| Add or swap chains | `src/wagmi.ts` (and the `ChainName` list in `src/lib/env.ts`) |
| Talk to your own contract | Replace the ABI and calls in `src/components/TokenCard.tsx`. Pass `abi` as `as const` for full type inference |
| Add more wallets | Add connectors in `src/wagmi.ts`. `useConnectors()` returns all of them |
| Restyle | `src/app/globals.css` is the only stylesheet |

## Layout

```
src/
  app/            layout (reads cookie for SSR state), providers, page, css
  components/     ConnectButton, TokenCard
  lib/            format.ts, errors.ts, env.ts  (pure functions, unit tested)
  wagmi.ts        chain + connector config
test/             vitest
```

## Scripts

| Command | Does |
| --- | --- |
| `pnpm dev` | Dev server |
| `pnpm build` / `pnpm start` | Production build / serve |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | Unit tests |

## Notes

- Built against wagmi 3, where `useAccount` became `useConnection` and the mutation hooks use `mutate` rather than `writeContract`/`connect`. If you're following v2 tutorials, expect those differences.
- The helpers are unit tested and the app builds and server-renders in CI-equivalent runs, but the wallet flow (connect, send) needs a browser wallet and isn't covered by automated tests.
- Only one chain is active at a time. Multi-chain needs a chain switcher; `useSwitchChain` is the starting point.

## License

MIT
