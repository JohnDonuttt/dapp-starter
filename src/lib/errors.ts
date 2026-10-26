/**
 * viem/wagmi errors are deep and verbose. Pull out the part a user can act on:
 * a rejected signature, a revert reason, or the short message.
 */
export function getErrorMessage(error: unknown): string {
  if (!error) return "";
  const err = error as { name?: string; shortMessage?: string; message?: string; cause?: unknown };

  const text = `${err.name ?? ""} ${err.shortMessage ?? ""} ${err.message ?? ""}`;
  if (/UserRejected|User rejected|User denied/i.test(text)) return "Transaction rejected in wallet.";

  const reverted = /reverted with the following reason:\s*(.+)/i.exec(err.shortMessage ?? err.message ?? "");
  if (reverted?.[1]) return `Reverted: ${reverted[1].split("\n")[0]}`;

  return err.shortMessage ?? err.message?.split("\n")[0] ?? "Something went wrong.";
}
