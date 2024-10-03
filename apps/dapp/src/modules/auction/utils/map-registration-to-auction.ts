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

    const chain = getChainById(168587773); // TODO:  remove
    // const chain = getChainById(launch.chainId);

    const auctionHouse = getAuctionHouse({
      chainId: 168587773,
      auctionType: AuctionType.SEALED_BID,
    });

    const auctionId = `${chain.id}-${auctionHouse.address}-${launchNameId}`;

    return {
      callbacks: "0x0000000000000000000000000000000000000000",
      auctionType: "01EMPA",
      id: auctionId,
      chain: chain.name.toLowerCase(),
      chainId: 168587773,
      auctionHouse: auctionHouse.address,
      lotId: launchNameId,
      curator: "0x32f33a14e36Cb75b3F58E1822418599e3f075Ffb", // TODO: this is baseline curator, get real curator
      curatorApproved: true,
      seller: "0x0000000000000000000000000000000000000000",
      bids: [],
      status: "registering",
      registrationDeadline: launch.deadline,
      info: {
        key: auctionId,
        name: launch.name,
        description: launch.description,
        tagline: "Zapz is your superpower in the Blast ecosystem", // TODO: launch.tagline
        links: [
          {
            linkId: "website",
            url: "https://hyperlock.finance/", // TODO: launch.website
          },
          {
            linkId: "twitter",
            url: "https://twitter.com/hyperlockfi", // TODO: launch.twitter
          },
          {
            linkId: "projectLogo",
            url: "https://pbs.twimg.com/profile_images/1753181713277005824/NjRRbh-N_400x400.png", // TODO: launch.projectLogo
          },
          {
            linkId: "projectBanner",
            url: launch.imageUrl ?? "",
          },
          {
            linkId: "discord",
            url: "http://discord.gg/H8Ra6Qd8aN", // TODO: launch.discord
          },
        ],
      },
    };
  });
};
