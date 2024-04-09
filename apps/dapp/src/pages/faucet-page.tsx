import React from "react";
import { Button, Select } from "@repo/ui";
import { BlockExplorerLink } from "components/blockexplorer-link";
import { LoadingIndicator } from "modules/app/loading-indicator";
import { PageContainer } from "modules/app/page-container";
import { useMintToken } from "modules/token/use-mint-token";
import { useTokenLists } from "state/tokenlist";
import { useChainId } from "wagmi";

export function FaucetPage() {
  const tokenlists = useTokenLists();
  const chainId = useChainId();
  const amount = "10000";

  const tokens = React.useMemo(
    () =>
      tokenlists.lists
        .flatMap((t) => t.tokens)
        .filter((t) => t.chainId === chainId && t.mintable),
    [chainId],
  );

  console.log(tokens);
  const options = React.useMemo(() => {
    return tokens.map((t) => ({
      label: t.symbol,
      imgURL: t.logoURI,
      value: t,
    }));
  }, [tokens]);

  const [token, setToken] = React.useState(tokens[0]);
  const mint = useMintToken(token, amount);

  return (
    <PageContainer title="Faucet">
      <div className="flex justify-start gap-x-1">
        <Select
          //@ts-expect-error TODO: make generic
          options={options}
          //@ts-expect-error TODO: make generic
          onChange={setToken}
          triggerClassName="max-w-40"
        />

        <div className="flex items-center gap-x-1">
          <Button onClick={mint.handleMint}>Mint</Button>
        </div>
      </div>
      <div className="mt-4">
        {mint.mintReceipt.isLoading && (
          <div className="flex items-center">
            Waiting confirmation{" "}
            <div className="size-8">
              <LoadingIndicator className="size-8 fill-white" />
            </div>
          </div>
        )}
        {mint.mintTx.isSuccess && (
          <div>
            Hash:{" "}
            <BlockExplorerLink chainId={chainId} hash={mint.mintTx.data} />
          </div>
        )}
        {mint.mintReceipt.isSuccess && (
          <>
            <p>
              Minted {amount} {token.symbol}{" "}
            </p>
            Token Address{" "}
            <BlockExplorerLink trim chainId={chainId} address={token.address} />
          </>
        )}
      </div>
    </PageContainer>
  );
}
