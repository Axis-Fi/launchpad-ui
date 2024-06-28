import type { Meta, StoryObj } from "@storybook/react";
import { AuctionCard, AuctionCardLoading } from "modules/auction/auction-card";
import { getBatchAuctionMock } from "../mocks/batch-auction";
import { AuctionCardBanner } from "modules/auction/auction-card-banner";
import { activeChains } from "@repo/env/src/chains";

const chain = activeChains[0];

const meta = {
  title: "Auctions/AuctionCardBanner",
  component: AuctionCardBanner,
} satisfies Meta<typeof AuctionCardBanner>;

export default meta;

type Story = StoryObj<typeof AuctionCard>;

export const Primary: Story = {
  args: {
    image:
      "https://indieground.net/wp-content/uploads/2023/03/Freebie-GradientTextures-Preview-06.jpg",
    chain,
    deadline: new Date(1715981309 * 1000),
    curator: {
      name: "aphex",
      avatar: "https://github.com/wenfix.png",
    },
  },
};
