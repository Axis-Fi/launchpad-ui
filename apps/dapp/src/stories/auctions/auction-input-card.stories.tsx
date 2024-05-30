import type { Meta, StoryObj } from "@storybook/react";
import { AuctionActionCard } from "modules/auction/auction-action-card";
import { getBatchAuctionMock } from "../mocks/batch-auction";

const meta = {
  title: "Auctions/AuctionInputCard",
  component: AuctionActionCard,
  args: {
    auction: getBatchAuctionMock(),
    submitText: "Bid",
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AuctionActionCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
