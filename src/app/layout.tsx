import type { Metadata } from "next";
import type { ReactNode } from "react";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { getConfig } from "@/wagmi";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "dapp-starter",
  description: "Next.js + wagmi + viem starter for EVM dapps",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const initialState = cookieToInitialState(getConfig(), (await headers()).get("cookie"));

  return (
    <html lang="en">
      <body>
        <Providers initialState={initialState}>{children}</Providers>
      </body>
    </html>
  );
}
