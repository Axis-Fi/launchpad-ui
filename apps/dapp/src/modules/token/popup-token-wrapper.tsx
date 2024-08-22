import { Button, Popover, PopoverContent, PopoverTrigger } from "@repo/ui";
import { TokenWrapper } from "./token-wrapper";
import { Auction, PropsWithAuction } from "@repo/types";
import { getChainById } from "utils/chain";

export function PopupTokenWrapper({ auction }: PropsWithAuction) {
  const { nativeCurrency } = getChainById(auction.chainId);
  const isQuoteAGasToken = isQuoteAWrappedGasToken(auction);

  if (isQuoteAGasToken && nativeCurrency.wrapperContract) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary" size="sm">
            Wrap
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[340px]">
          <TokenWrapper />
        </PopoverContent>
      </Popover>
    );
  }

  return null;
}

export function isQuoteAWrappedGasToken(auction: Auction) {
  const quoteSymbol = auction.quoteToken.symbol.toLowerCase();
  const { nativeCurrency } = getChainById(auction.chainId);
  return `w${nativeCurrency.symbol}`.toLowerCase() === quoteSymbol;
}
