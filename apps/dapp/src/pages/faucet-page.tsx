import React from "react";
import { Button, Input, LabelWrapper, Select } from "@repo/ui";
import { BlockExplorerLink } from "components/blockexplorer-link";
import { LoadingIndicator } from "modules/app/loading-indicator";
import { PageContainer } from "modules/app/page-container";
import { useMintToken } from "modules/token/use-mint-token";
import { useTokenLists } from "state/tokenlist";
import { useChainId } from "wagmi";
import { trimCurrency } from "utils/currency";

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

  const [amount, setAmount] = React.useState<string>("10000");
  const [token, setToken] = React.useState(tokens[0]);

  const mint = useMintToken(token, amount);
  const disabled = !mint.mintCall.isSuccess;

  return (
    <PageContainer title="Faucet">
      <div className="mx-auto flex max-w-sm flex-col justify-center gap-2">
        <LabelWrapper content="Token">
          {options.length ? (
            <Select
              //@ts-expect-error TODO: make generic
              options={options}
              //@ts-expect-error TODO: make generic
              onChange={setToken}
            />
          ) : (
            <div className="font-aeonpro text-center text-xs">
              No tokens available in this chain. <br />
            </div>
          )}
        </LabelWrapper>

        <LabelWrapper content="Amount">
          <Input value={amount} onChange={(e) => setAmount(e.target.value)} />
        </LabelWrapper>
        <Button disabled={disabled} className="mt-4" onClick={mint.handleMint}>
          Mint
        </Button>
      </div>
      <div className="mx-auto mt-4 text-center">
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
            View transaction on&nbsp;
            <BlockExplorerLink
              showName
              chainId={chainId}
              hash={mint.mintTx.data}
            />
          </div>
        )}
        {mint.mintReceipt.isSuccess && (
          <>
            <p>
              Minted {trimCurrency(amount)} {token.symbol}{" "}
            </p>
            Token Address{" "}
            <BlockExplorerLink chainId={chainId} address={token.address} />
          </>
        )}
      </div>
    </PageContainer>
  );
}
