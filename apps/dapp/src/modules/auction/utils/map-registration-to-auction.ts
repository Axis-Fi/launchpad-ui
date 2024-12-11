import { getAuctionHouse } from "utils/contracts";
import { getChainById } from "utils";
import type { Launch } from "@repo/points";
import { type Auction, AuctionType } from "@axis-finance/types";
import { lowerDashify } from "./format-chain-name";

export const mapRegistrationToAuction = (
  launches: Launch[] = [],
): Auction[] => {
  const auctions: Auction[] = [];

  launches.forEach((launch) => {
    if (launch.name == null || launch.chainId == null) return;

    const launchNameId = lowerDashify(launch.name.toLowerCase());

    const chain = getChainById(launch.chainId);

    const auctionHouse = getAuctionHouse({
      chainId: chain.id,
      auctionType: AuctionType.SEALED_BID,
    });

    const auctionId = `${chain.id}-${auctionHouse.address}-${launchNameId}`;

    auctions.push({
      callbacks: "0x0000000000000000000000000000000000000000",
      auctionType: AuctionType.SEALED_BID, // For registration launches, the auction type has no effect
      id: auctionId,
      chain: chain.name.toLowerCase(),
      chainId: chain.id,
      auctionHouse: auctionHouse.address,
      lotId: launchNameId,
      curatorApproved: true,
      seller: "0x0000000000000000000000000000000000000000",
      bids: [],
      status: "registering",
      registrationDeadline: launch.deadline,
      fdv: launch.valuation,
      isSecure: true,
      info: {
        key: auctionId,
        name: launch.name,
        description: launch.description,
        tagline: launch.tagline,
        links: [
          {
            linkId: "website",
            url: launch.websiteUrl ?? "",
          },
          {
            linkId: "twitter",
            url: launch.twitterUrl ?? "",
          },
          {
            linkId: "projectLogo",
            url: launch.projectLogoUrl
              ? location.protocol + "//" + launch.projectLogoUrl
              : "",
          },
          {
            linkId: "projectBanner",
            url: launch.projectBannerUrl
              ? location.protocol + "//" + launch.projectBannerUrl
              : "",
          },
          {
            linkId: "discord",
            url: launch.discordUrl ?? "",
          },
        ],
      },

      // TODO: update subgraph so these values aren't required
      createdBlockNumber: "",
      createdBlockTimestamp: "",
      createdDate: "",
      createdTransactionHash: "",
      capacityInitial: "",
      start: "",
      conclusion: "",
      wrapDerivative: false,
      curatorFee: "",
      protocolFee: "",
      referrerFee: "",
      capacity: "",
      sold: "",
      purchased: "",
      lastUpdatedBlockNumber: "",
      lastUpdatedBlockTimestamp: "",
      lastUpdatedDate: "",
      lastUpdatedTransactionHash: "",
      maxBidId: "",
      created: {
        infoHash: "",
      },
      bidsDecrypted: [],
      bidsClaimed: [],
      bidsRefunded: [],
      baseToken: {
        chainId: 0,
        address: "0x",
        symbol: "",
        decimals: 0,
        name: "",
      },
      quoteToken: {
        chainId: 0,
        address: "0x",
        symbol: "",
        decimals: 0,
        name: "",
      },
    });
  });

  return auctions satisfies Auction[];
};
