import type { Meta, StoryObj } from "@storybook/react";
import { AuctionCard, AuctionCardLoading } from "modules/auction/auction-card";
import { getBatchAuctionMock } from "../mocks/batch-auction";

const meta = {
  title: "Auctions/AuctionCard",
  component: AuctionCard,
  args: {
    auction: getBatchAuctionMock(),
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AuctionCard>;

export default meta;

type Story = StoryObj<typeof AuctionCard>;

export const Created: Story = {
  args: { ...meta.args, auction: { ...meta.args.auction, status: "created" } },
};

export const Cancelled: Story = {
  args: {
    ...meta.args,
    auction: { ...meta.args.auction, status: "cancelled" },
  },
};

export const Live: Story = {
  args: { ...meta.args, auction: { ...meta.args.auction, status: "live" } },
};

export const Concluded: Story = {
  args: {
    ...meta.args,
    auction: { ...meta.args.auction, status: "concluded" },
  },
};

export const Decrypted: Story = {
  args: {
    ...meta.args,
    auction: { ...meta.args.auction, status: "decrypted" },
  },
};

export const Settled: Story = {
  args: { ...meta.args, auction: { ...meta.args.auction, status: "settled" } },
};

export const Loading: Story = {
  render: () => <AuctionCardLoading />,
};
