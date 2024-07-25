import { zeroAddress, type Chain } from "viem";
import { AuctionType } from "@repo/types";
import type { Address, NonNullSubgraphAuction } from "@repo/types";
import type { GetAuctionLotsQuery } from "@repo/subgraph-client";
import { CreateAuctionForm } from "pages/create-auction-page";
import { formatChainName } from "modules/auction/utils/format-chain-name";
import { getAuctionId } from "modules/auction/utils/get-auction-id";

/**
 * Creates a fake auction object based on the auction details the user entered.
 * This is used after the create-auction transaction succeeds to mitigate subgraph update delays.
 */
const createOptimisticAuction = (
  lotId: number,
  chain: Chain,
  seller: Address,
  auctionHouseAddress: Address,
  createAuctionFormValues: CreateAuctionForm,
): NonNullSubgraphAuction => {
  const {
    capacity,
    start,
    deadline,
    name,
    description,
    tagline,
    projectBanner,
    auctionType: _auctionType,
    callbacks,
    curator,
    quoteToken,
    payoutToken,
    price,
    minPrice,
    minFillPercent,
  } = createAuctionFormValues;

  const auctionType = _auctionType as AuctionType;
  const chainName = formatChainName(chain);
  const auctionId = getAuctionId(chain.id, lotId);

  return {
    id: auctionId,
    chain: chainName,
    auctionHouse: auctionHouseAddress,
    aborted: null,
    cancelled: null,
    lotId: lotId.toString(),
    createdBlockNumber: "11904423",
    createdBlockTimestamp: Math.floor(Date.now() / 1000).toString(),
    createdDate: new Date().toISOString(),
    createdTransactionHash: "0xUnknown",
    capacityInitial: capacity,
    start: Math.floor(start.getTime() / 1000).toString(),
    info: {
      key: null,
      name,
      description,
      tagline,
      links: [
        {
          linkId: "payoutTokenLogo",
          url: payoutToken.logoURI!,
        },
        {
          linkId: "projectBanner",
          url: projectBanner,
        },
      ],
    },
    conclusion: Math.floor(deadline.getTime() / 1000).toString(),
    auctionType: `01${auctionType}`,
    seller,
    derivativeType: null,
    wrapDerivative: false,
    callbacks: callbacks || zeroAddress,
    curator,
    curatorApproved: false,
    curatorFee: "0",
    protocolFee: "0",
    referrerFee: "0",
    capacity,
    sold: "0",
    purchased: "0",
    lastUpdatedBlockNumber: "11904423",
    lastUpdatedBlockTimestamp: Math.floor(Date.now() / 1000).toString(),
    lastUpdatedDate: new Date().toISOString(),
    lastUpdatedTransactionHash: "0xUnknown",
    linearVesting: null,
    // @ts-expect-error TODO
    baseToken: payoutToken,
    // @ts-expect-error TODO
    quoteToken: quoteToken,
    created: {
      infoHash: "unknown",
    },
    curated: null,
    maxBidId: "0",
    bids: [],
    bidsDecrypted: [],
    bidsClaimed: [],
    bidsRefunded: [],
    encryptedMarginalPrice: {
      id: auctionId,
      status: "created",
      settlementSuccessful: false,
      minPrice: minPrice!,
      minFilled: (
        Number(capacity) * Number(minFillPercent?.[0] ?? 0.5)
      ).toString(),
      minBidSize: "0.01",
      marginalPrice: null,
      hasPartialFill: null,
    },
    fixedPrice: {
      id: auctionId,
      status: "created",
      settlementSuccessful: false,
      price: price!,
      minFilled: (
        Number(capacity) * Number(minFillPercent?.[0] ?? 0.5)
      ).toString(),
      hasPartialFill: null,
      partialBidId: null,
    },
    settled: null,
  };
};

const insertAuction = (
  cachedAuctions: GetAuctionLotsQuery,
  auction: NonNullSubgraphAuction,
): GetAuctionLotsQuery => ({
  ...cachedAuctions,
  batchAuctionLots: cachedAuctions.batchAuctionLots.concat(auction!),
});

export { insertAuction, createOptimisticAuction };
