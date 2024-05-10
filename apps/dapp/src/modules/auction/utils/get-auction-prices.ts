import { SortedBid } from "modules/auction/hooks/use-sorted-bids";
import { Auction, EMPAuctionData } from "@repo/types";
import { formatUnits } from "viem";

/** Calculates the minimum and marginal price for an Auction
 *  @author Oighty, 0xJem
 */
export function getAuctionPrices(
  data: SortedBid[],
  auction: Auction,
  auctionData: EMPAuctionData,
) {
  // Ensure bids are sorted by price
  data.sort((a, b) => a.price - b.price);

  const minimumPrice = Number(
    formatUnits(auctionData.minimumPrice, Number(auction.quoteToken.decimals)),
  );

  const minimumFill = Number(
    formatUnits(auctionData.minFilled, Number(auction.baseToken.decimals)),
  );

  const capacity = Number(
    formatUnits(BigInt(auction.capacity), Number(auction.baseToken.decimals)),
  );

  let marginalPrice = 0;
  let totalAmountIn = 0;
  let capacityExpended = 0;
  let lastPrice = 0;
  for (let i = 0; i < data.length; i++) {
    const bid = data[i];

    if (bid.price < minimumPrice) {
      marginalPrice = lastPrice;
      break;
    }

    lastPrice = bid.price;
    totalAmountIn += bid.amountIn;
    capacityExpended = totalAmountIn * bid.price;

    if (capacityExpended >= capacity) {
      marginalPrice = bid.price;
      break;
    }

    if (i == data.length - 1) {
      marginalPrice = bid.price;
    }
  }

  if (capacityExpended < minimumFill) {
    marginalPrice = 0;
  }

  return { marginalPrice, minimumPrice };
}
