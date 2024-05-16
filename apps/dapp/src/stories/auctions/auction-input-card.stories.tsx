import type { Meta, StoryObj } from "@storybook/react";
import { AuctionInputCard } from "modules/auction/auction-input-card";
import { getBatchAuctionMock } from "../mocks/batch-auction";

const meta = {
  title: "Auctions/AuctionInputCard",
  component: AuctionInputCard,
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
} satisfies Meta<typeof AuctionInputCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
