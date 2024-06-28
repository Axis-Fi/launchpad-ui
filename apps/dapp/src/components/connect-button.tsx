import { ConnectButton as RKConnectButton } from "@rainbow-me/rainbowkit";
import { Avatar, Button, cn, type ButtonProps } from "@repo/ui";

export default function ConnectButton({
  className,
  size,
}: {
  className?: string;
  size?: ButtonProps["size"];
}) {
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
            className={cn("w-full max-w-md", className)}
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
                  <Button
                    size={size}
                    className="w-full"
                    onClick={openConnectModal}
                  >
                    CONNECT WALLET
                  </Button>
                );
              }
              if (chain.unsupported) {
                return (
                  <Button
                    size={size}
                    variant="secondary"
                    onClick={openChainModal}
                  >
                    Wrong network
                  </Button>
                );
              }
              return (
                <div className="flex items-center gap-x-1">
                  <Button
                    size={size}
                    variant="ghost"
                    onClick={openAccountModal}
                  >
                    {account.displayName}
                    {/*account.displayBalance ? ` (${account.displayBalance})` : ""*/}
                  </Button>

                  <Button variant="ghost" size="icon" onClick={openChainModal}>
                    <div
                      className="h-7 w-7 overflow-hidden rounded-full"
                      style={{ background: chain.iconBackground }}
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
