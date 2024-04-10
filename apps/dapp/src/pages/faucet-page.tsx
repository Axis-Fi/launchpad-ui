import React from "react";
import {
  Button,
  Input,
  LabelWrapper,
  Select,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui";
import { BlockExplorerLink } from "components/blockexplorer-link";
import { LoadingIndicator } from "modules/app/loading-indicator";
import { PageContainer } from "modules/app/page-container";
import { useMintToken } from "modules/token/use-mint-token";
import { useTokenLists } from "state/tokenlist";
import { useChainId } from "wagmi";
import useERC20 from "loaders/use-erc20";
import { Address, isAddress } from "viem";
import { Token } from "@repo/types";

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

  const [address, setAddress] = React.useState<Address>();
  const [amount, setAmount] = React.useState<string>("10000");
  const [token, setToken] = React.useState(tokens[0]);

  const erc20 = useERC20({
    address: address as Address,
    chainId,
  });

  const _token = erc20.response.isSuccess ? (erc20.token as Token) : token;
  const mint = useMintToken(_token, amount);
  const disabled = !_token?.address;

  return (
    <PageContainer title="Faucet">
      <div className="mx-auto flex max-w-sm flex-col justify-center gap-2">
        <Tabs defaultValue="address" className="w-full">
          <TabsList className="w-full *:w-full">
            <TabsTrigger value="address">By Address</TabsTrigger>
            <TabsTrigger value="token">By Token</TabsTrigger>
          </TabsList>
          <TabsContent value="token">
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
                  Try searching by address.
                </div>
              )}
            </LabelWrapper>
          </TabsContent>
          <TabsContent value="address">
            <LabelWrapper content="Token Address">
              <Input
                onChange={(e) =>
                  isAddress(e.target.value) && setAddress(e.target.value)
                }
              />
              {erc20.response.isFetched && (
                <p className="text-center">
                  Token found: {erc20.token.name} - {erc20.token.symbol}
                </p>
              )}
            </LabelWrapper>
          </TabsContent>
        </Tabs>

        <LabelWrapper content="Amount">
          <Input value={amount} onChange={(e) => setAmount(e.target.value)} />
        </LabelWrapper>
        <Button disabled={disabled} className="mt-4" onClick={mint.handleMint}>
          Mint
        </Button>
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
