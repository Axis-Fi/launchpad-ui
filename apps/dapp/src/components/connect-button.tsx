import { ConnectButton as RKConnectButton } from "@rainbow-me/rainbowkit";
import {
  Avatar,
  Button,
  Text,
  cn,
  type ButtonProps,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@repo/ui";
import { useMediaQueries } from "loaders/use-media-queries";
import { useDisconnect } from "wagmi";

export default function ConnectButton({
  className,
  size,
}: {
  className?: string;
  size?: ButtonProps["size"];
}) {
  const { isTabletOrMobile } = useMediaQueries();
  const { disconnect } = useDisconnect();

  return (
    <RKConnectButton.Custom>
      {({ account, chain, openChainModal, openConnectModal, mounted }) => {
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
                    data-testid="connect-wallet"
                    size={size}
                    className={"w-full"}
                    onClick={openConnectModal}
                  >
                    CONNECT {isTabletOrMobile ? "" : "WALLET"}
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
                <div className={cn("flex items-center gap-x-1 ")}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-x-1">
                        <div className="space-y-1">
                          <Text className="leading-none">
                            {account.ensName ?? account.displayName}
                          </Text>
                        </div>
                        {/*account.displayBalance ? ` (${account.displayBalance})` : ""*/}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="px-md gap-y-xs bg-surface shadow-3xl flex max-w-[200px] flex-col rounded-none border-none font-mono uppercase">
                      <DropdownMenuItem onClick={openChainModal}>
                        Switch Chain
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => disconnect()}>
                        Disconnect
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

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
