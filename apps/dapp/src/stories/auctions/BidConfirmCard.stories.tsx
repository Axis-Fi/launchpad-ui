import type { Meta, StoryObj } from "@storybook/react";
import { BidConfirmCard } from "modules/auction/bid-confirm-card";
import { mockAuction } from "../mocks/auction";

const meta = {
  title: "Auctions/BidConfirmCard",
  component: BidConfirmCard,
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
} satisfies Meta<typeof BidConfirmCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
