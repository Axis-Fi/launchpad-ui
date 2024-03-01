import { Token } from "@repo/deployments/src/types";
import {
  Button,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  IconedLabel,
  ScrollArea,
  Tooltip,
  trimAddress,
} from "@repo/ui";
import React from "react";
import { TokenListManager } from "./token-list-manager";
import { ArrowLeftIcon } from "lucide-react";
import { useTokenLists } from "context/tokenlist-provider";

type TokenSelectDialogProps = {
  onSelect: (token: Token) => void;
  chainId: number;
};

/** Shows a list of tokens per chain and a way to manage tokenlists*/
export function TokenSelectDialog(props: TokenSelectDialogProps) {
  const { getTokensByChainId } = useTokenLists();
  const [isManaging, setIsManaging] = React.useState(false);

  const tokens = getTokensByChainId(168587773);

  return (
    <DialogRoot open={true}>
      {isManaging ? (
        <DialogContent className="max-w-sm">
          <DialogHeader className="flex-row items-center gap-x-2">
            <Button
              onClick={() => setIsManaging(false)}
              size="icon"
              variant="ghost"
              className="size-6"
            >
              <ArrowLeftIcon />
            </Button>
            <p>Manage Tokenlist</p>
          </DialogHeader>
          <TokenListManager />
        </DialogContent>
      ) : (
        <DialogContent className="max-w-sm">
          <DialogHeader>Select Token</DialogHeader>
          <div>
            <ScrollArea className="h-[300px]">
              {tokens.map((t, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="lg"
                  className="block w-full rounded-none border-x border-b-0 border-t px-2 first:rounded-t-sm last:rounded-b-sm last:border-b"
                  onClick={() => props.onSelect(t)}
                >
                  <TokenSelectRow token={t} />
                </Button>
              ))}
            </ScrollArea>
          </div>
          <DialogFooter>
            <Button
              onClick={(e) => {
                e.preventDefault();
                setIsManaging(true);
              }}
            >
              Manage Tokenlist
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </DialogRoot>
  );
}

/** Displays token symbol, logo and contract address*/
function TokenSelectRow({ token }: { token: Token }) {
  const isLongSymbol = token.symbol.length > 7;
  const label = isLongSymbol
    ? `${token.symbol.substring(0, 6)}...`
    : token.symbol;
  return (
    <div className="flex items-center justify-between gap-x-2 p-1 ">
      <Tooltip content={isLongSymbol && token.symbol}>
        <IconedLabel src={token.logoURI} label={label} />
        <p className="text-xs">{trimAddress(token.address, 8)}</p>
      </Tooltip>
    </div>
  );
}
