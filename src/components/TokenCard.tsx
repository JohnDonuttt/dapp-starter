"use client";

import { useEffect, useState } from "react";
import { erc20Abi, zeroAddress } from "viem";
import { useConnection, useReadContracts, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { env } from "@/wagmi";
import { asAddress, formatTokenAmount, parseAmountInput } from "@/lib/format";
import { getErrorMessage } from "@/lib/errors";

const token = { address: env.tokenAddress, abi: erc20Abi } as const;

export function TokenCard() {
  const { address, isConnected } = useConnection();
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  const notConfigured = env.tokenAddress === zeroAddress;

  const { data, refetch, isLoading, error: readError } = useReadContracts({
    allowFailure: false,
    contracts: [
      { ...token, functionName: "symbol" },
      { ...token, functionName: "decimals" },
      { ...token, functionName: "balanceOf", args: [address ?? zeroAddress] },
    ],
    query: { enabled: !notConfigured && isConnected },
  });

  const { mutate: transfer, data: hash, isPending, error: writeError, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // refresh the balance once the transfer is mined
  useEffect(() => {
    if (isSuccess) {
      refetch();
      setAmount("");
    }
  }, [isSuccess, refetch]);

  if (notConfigured) {
    return (
      <section>
        <p>
          Set <code>NEXT_PUBLIC_TOKEN_ADDRESS</code> in <code>.env.local</code> to an ERC-20 on the selected
          chain.
        </p>
      </section>
    );
  }

  if (!isConnected) return <section>Connect a wallet to see your balance.</section>;
  if (isLoading) return <section>Loading…</section>;
  if (readError || !data) {
    return (
      <section className="error">
        Couldn&apos;t read the token. Is the address deployed on {env.chain}?
        <br />
        {getErrorMessage(readError)}
      </section>
    );
  }

  const [symbol, decimals, balance] = data;
  const recipient = asAddress(to);
  const parsed = parseAmountInput(amount, decimals);
  const insufficient = parsed !== null && parsed > balance;
  const canSend = recipient !== null && parsed !== null && parsed > 0n && !insufficient;
  const busy = isPending || isConfirming;

  return (
    <section>
      <h2>
        {formatTokenAmount(balance, decimals)} {symbol}
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!canSend) return;
          reset();
          transfer({ ...token, functionName: "transfer", args: [recipient, parsed] });
        }}
      >
        <label>
          Recipient
          <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="0x…" spellCheck={false} />
        </label>
        <label>
          Amount
          <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.0" inputMode="decimal" />
        </label>

        {to && !recipient && <p className="error">Not a valid address.</p>}
        {insufficient && <p className="error">Amount is more than your balance.</p>}

        <button disabled={!canSend || busy}>
          {isPending ? "Confirm in wallet…" : isConfirming ? "Waiting for block…" : `Send ${symbol}`}
        </button>
      </form>

      {writeError && <p className="error">{getErrorMessage(writeError)}</p>}
      {isSuccess && hash && <p className="ok">Sent. Tx: <code>{hash}</code></p>}
    </section>
  );
}
