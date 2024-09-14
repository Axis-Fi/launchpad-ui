import { Button } from "@/components";
import { LinkedWalletsTable } from "./linked-wallets-table";
import { ConnectedWallet } from "./connected-wallet";
import { useAccount } from "wagmi";
import { useProfile } from "./hooks/use-profile";

export function LinkWalletForm({ onSubmit }: { onSubmit?: () => void }) {
  const { address } = useAccount();
  const { profile } = useProfile();

  if (profile == null) return null;

  const isConnectedWalletLinked = profile.wallets?.some(
    (w) => w.address === address,
  );

  return (
    <div className="gap-y-md flex flex-col">
      <ConnectedWallet trim={true} />
      {isConnectedWalletLinked && <>You&apos;ve already linked this wallet</>}
      {!isConnectedWalletLinked && <>You&apos;re linking a new wallet</>}
      {/* <Button size="md" variant="primary" onClick={handleConnectWallet}>
          Link wallet
        </Button> */}

      <LinkedWalletsTable
        visibleColumns={["totalPoints"]}
        // trimWalletAddress={false}
        showSubtitle={false}
      />
      <Button
        variant="primary"
        onClick={onSubmit}
        disabled={isConnectedWalletLinked}
      >
        Link wallet
      </Button>
    </div>
  );
}
