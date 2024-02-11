import type { Meta, StoryObj } from "@storybook/react";
import { AuctionCard, AuctionCardLoading } from "modules/auction/auction-card";
import { mockAuction } from "../mocks/auction";

const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

const meta = {
  title: "Auctions/AuctionCard",
  component: AuctionCard,
  args: {
    auction: mockAuction,
    socials: {
      twitter: url,
      discord: url,
      homepage: url,
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />{" "}
      </div>
    ),
  ],
} satisfies Meta<typeof AuctionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {};
export const Loading: Story = {
  render: () => <AuctionCardLoading />,
};
