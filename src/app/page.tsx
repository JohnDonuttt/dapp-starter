import { ConnectButton } from "@/components/ConnectButton";
import { TokenCard } from "@/components/TokenCard";

export default function Home() {
  return (
    <main>
      <header>
        <h1>dapp-starter</h1>
        <ConnectButton />
      </header>
      <TokenCard />
    </main>
  );
}
