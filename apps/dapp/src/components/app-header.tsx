import { ConnectButton } from "@rainbow-me/rainbowkit";
import Navbar from "./navbar";
import { ThemeSwitcher } from "@repo/ui";

export function AppHeader() {
  return (
    <div className="mx-auto flex justify-between">
      <div className="flex w-1/3 items-center gap-x-2 text-4xl">
        <img width={80} height={26} src="/images/wordmark.svg" />
        <img width={30} height={26} src="/images/logo.svg" />
      </div>
      <Navbar />

      <div className="flex w-1/3 items-center justify-end gap-x-2">
        <ConnectButton />
        <ThemeSwitcher />
      </div>
    </div>
  );
}
