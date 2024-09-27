import type { RegistrationLaunch } from "@repo/types";

export const registrationLaunches: RegistrationLaunch[] = [
  {
    callbacks: "0x0000000000000000000000000000000000000000",
    auctionType: "01EMPA",
    id: "blast-0xba000055df41da8584e1251bcdf45e91acb61108-hyperlock",
    chain: "blast",
    chainId: 81457,
    auctionHouse: "0xba000055df41da8584e1251bcdf45e91acb61108",
    lotId: "hyperlock",
    curator: "0x32f33a14e36Cb75b3F58E1822418599e3f075Ffb", // TODO: this is baseline curator, get real curator
    curatorApproved: true,
    seller: "0x0000000000000000000000000000000000000000",
    bids: [],
    status: "registering",
    registrationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // TODO: 7 days from now for testing
    info: {
      key: "blast-0xba000055df41da8584e1251bcdf45e91acb61108-hyperlock",
      name: "Hyperlock",
      description:
        "Hyperlock is a yield & metagovernance protocol built on Thruster and optimized for Blast. The protocol provides boosted rewards to Thruster LPs and THRUST stakers via the social aggregation of veTHRUST and Hyperlock’s native token.",
      tagline: "Hyperlock is your superpower in the Blast & Thruster ecosystem",
      links: [
        {
          linkId: "website",
          url: "https://hyperlock.finance/",
        },
        {
          linkId: "twitter",
          url: "https://twitter.com/hyperlockfi",
        },
        {
          linkId: "projectLogo",
          url: "https://pbs.twimg.com/profile_images/1753181713277005824/NjRRbh-N_400x400.png",
        },
        {
          linkId: "projectBanner",
          url: "https://pbs.twimg.com/profile_banners/1677208683539996673/1706825069/1500x500",
        },
        {
          linkId: "discord",
          url: "http://discord.gg/H8Ra6Qd8aN",
        },
      ],
    },
  },
];
