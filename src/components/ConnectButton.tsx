"use client";

import { useConnect, useConnection, useConnectors, useDisconnect } from "wagmi";
import { shortAddress } from "@/lib/format";
import { getErrorMessage } from "@/lib/errors";

export function ConnectButton() {
  const { address, isConnected } = useConnection();
  const connectors = useConnectors();
  const { mutate: connect, isPending, error } = useConnect();
  const { mutate: disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <div className="row">
        <code>{shortAddress(address)}</code>
        <button className="secondary" onClick={() => disconnect()}>
          Disconnect
        </button>
      </div>
    );
  }

  const connector = connectors[0];

  return (
    <div className="row">
      <button disabled={!connector || isPending} onClick={() => connector && connect({ connector })}>
        {isPending ? "Connecting…" : "Connect wallet"}
      </button>
      {error && <span className="error">{getErrorMessage(error)}</span>}
    </div>
  );
}
