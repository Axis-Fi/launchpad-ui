import { getAuctionHouse } from "utils/contracts";
import { getChainById } from "utils";
import type { Launch } from "@repo/points";
import { AuctionType, type RegistrationLaunch } from "@repo/types";
import { lowerDashify } from "./format-chain-name";

export const mapRegistrationToAuction = (
  launches: Launch[] = [],
): (RegistrationLaunch | undefined)[] => {
  return launches.map((launch) => {
    if (launch.name == null || launch.chainId == null) return undefined;

    const launchNameId = lowerDashify(launch.name.toLowerCase());

    const chain = getChainById(launch.chainId);

    const auctionHouse = getAuctionHouse({
      chainId: chain.id,
      auctionType: AuctionType.SEALED_BID,
    });

    const auctionId = `${chain.id}-${auctionHouse.address}-${launchNameId}`;

    return {
      callbacks: "0x0000000000000000000000000000000000000000",
      auctionType: "01EMPA",
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
    } satisfies RegistrationLaunch;
  });
};
