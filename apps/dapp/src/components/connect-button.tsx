import { ConnectButton as RKConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@repo/ui";

export default function ConnectButton() {
  return (
    <RKConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");
        return (
          <div
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
                  <Button variant="secondary" onClick={openConnectModal}>
                    Connect Wallet
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
                <div className="flex gap-1">
                  <Button variant="ghost" onClick={openChainModal}>
                    {chain.hasIcon ? (
                      <div
                        className="w-6 h-6 rounded-full overflow-hidden"
                        style={{
                          background: chain.iconBackground,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            className="w-6 h-6"
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                          />
                        )}
                      </div>
                    ) : (
                      chain.name
                    )}
                  </Button>
                  <Button variant="secondary" onClick={openAccountModal}>
                    {account.displayName}
                    {/*account.displayBalance ? ` (${account.displayBalance})` : ""*/}
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
