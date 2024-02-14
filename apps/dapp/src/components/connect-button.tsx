import { ConnectButton as RKConnectButton } from "@rainbow-me/rainbowkit";
import { Avatar, Button } from "@repo/ui";

export default function ConnectButton() {
  return (
    <RKConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        // Removed authentication stuff https://www.rainbowkit.com/docs/authentication
        const ready = mounted;
        const connected = ready && account && chain;
        return (
          <div
            className="w-full max-w-md"
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button className="w-full" onClick={openConnectModal}>
                    CONNECT
                  </Button>
                );
              }
              if (chain.unsupported) {
                return (
                  <Button variant="destructive" onClick={openChainModal}>
                    Wrong network
                  </Button>
                );
              }
              return (
                <div className="flex items-center gap-x-1">
                  <Button variant="outline" onClick={openAccountModal}>
                    {account.displayName}
                    {/*account.displayBalance ? ` (${account.displayBalance})` : ""*/}
                  </Button>

                  <Button variant="ghost" size="icon" onClick={openChainModal}>
                    <div
                      className="h-7 w-7 overflow-hidden rounded-full"
                      style={{
                        background: chain.iconBackground,
                      }}
                    >
                      <Avatar
                        className="hover:text-primary h-7 w-7"
                        alt={chain.name ?? "???"}
                        src={chain.iconUrl}
                      />
                    </div>
                  </Button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </RKConnectButton.Custom>
  );
}
