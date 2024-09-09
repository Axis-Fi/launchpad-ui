import { ConnectButton as RKConnectButton } from "@rainbow-me/rainbowkit";
import { Avatar, Button, Text, cn, type ButtonProps } from "@repo/ui";
import { useMediaQueries } from "loaders/use-media-queries";
import { useProfile } from "modules/points/use-profile";

export default function ConnectButton({
  className,
  size,
}: {
  className?: string;
  size?: ButtonProps["size"];
}) {
  const { isTabletOrMobile } = useMediaQueries();
  const { showProfile, profile } = useProfile();

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
                <div
                  className={cn(
                    "flex items-center gap-x-1 ",
                    showProfile && "gap-x-2",
                  )}
                >
                  <button
                    onClick={openAccountModal}
                    className="flex items-center gap-x-1"
                  >
                    {showProfile && (
                      <img className="size-[48px]" src={profile.avatar} />
                    )}
                    <div className="space-y-1">
                      {showProfile && (
                        <Text
                          className="text-foreground-highlight text-left leading-none"
                          size="lg"
                        >
                          {profile.username}
                        </Text>
                      )}
                      <Text uppercase className="leading-none">
                        {account.displayName}
                      </Text>
                    </div>
                    {/*account.displayBalance ? ` (${account.displayBalance})` : ""*/}
                  </button>

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
