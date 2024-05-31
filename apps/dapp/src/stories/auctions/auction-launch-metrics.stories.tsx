import type { Meta, StoryObj } from "@storybook/react";
import { AuctionLaunchMetrics } from "modules/auction/auction-launch-metrics";
import { getBatchAuctionMock } from "../mocks/batch-auction";

const meta = {
  title: "Auctions/AuctioLaunchMetrics",
  component: AuctionLaunchMetrics,
  args: {
    auction: getBatchAuctionMock(),
  },
  decorators: [
    (Story) => (
      <div className="w-[800px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AuctionLaunchMetrics>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
