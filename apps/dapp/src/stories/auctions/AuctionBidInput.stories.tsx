import type { Meta, StoryObj } from "@storybook/react";
import { AuctionBidInput } from "modules/auction/auction-bid-input";
import { mockAuction } from "../mocks/auction";

const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

const meta = {
  title: "Auctions/AuctionBidInput",
  component: AuctionBidInput,
  args: {
    auction: mockAuction,
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />{" "}
      </div>
    ),
  ],
} satisfies Meta<typeof AuctionBidInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
