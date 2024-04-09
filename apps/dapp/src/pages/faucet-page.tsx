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

  const tokens = React.useMemo(
    () =>
      tokenlists.lists
        .flatMap((t) => t.tokens)
        .filter((t) => t.chainId === chainId && t.mintable),
    [chainId],
  );

  const options = React.useMemo(() => {
    return tokens.map((t) => ({
      label: t.symbol,
      imgURL: t.logoURI,
      value: t,
    }));
  }, [tokens]);

  const [token, setToken] = React.useState(tokens[0]);
  const mint = useMintToken(token, "10000");

  return (
    <PageContainer title="Faucet">
      <div className="flex justify-start gap-x-1">
        <Select
          options={options}
          onChange={setToken}
          triggerClassName="max-w-40"
        />

        <div className="flex items-center gap-x-1">
          <Button onClick={mint.handleMint}>Mint</Button>
        </div>
      </div>
      {mint.mintReceipt.isLoading && (
        <div className="mt-4 ">
          {mint.mintTx.data && (
            <div>
              Hash:{" "}
              <BlockExplorerLink chainId={chainId} hash={mint.mintTx.data} />
            </div>
          )}
          <div className="flex items-center">
            Waiting confirmation{" "}
            <div className="size-8">
              <LoadingIndicator className="size-8 fill-white" />
            </div>
          </div>
        </div>
      )}
      {mint.mintReceipt.isSuccess && <p>Success! </p>}
    </PageContainer>
  );
}
