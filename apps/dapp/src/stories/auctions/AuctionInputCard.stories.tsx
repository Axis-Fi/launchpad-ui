import type { Meta, StoryObj } from "@storybook/react";
import { AuctionInputCard } from "modules/auction/auction-input-card";
import { mockAuction } from "../mocks/auction";

const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

const meta = {
  title: "Auctions/AuctionInputCard",
  component: AuctionInputCard,
  args: {
    auction: mockAuction,
    submitText: "Bid",
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
} satisfies Meta<typeof AuctionInputCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {};
// export const Loading: Story = {
//   render: () => <AuctionInputCardLoading />,
// };
