import type { Meta, StoryObj } from "@storybook/react";
import { getBatchAuctionMock } from "../mocks/batch-auction";
import { NotConnectedClaimCard } from "modules/auction/claim-card/not-connected";

const meta = {
  title: "Auctions/Bid Claim/Not Connected",
  component: NotConnectedClaimCard,
  args: {
    auction: getBatchAuctionMock(),
  },
  decorators: [
    (Story) => (
      <div className="flex w-[496px] items-start">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NotConnectedClaimCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
