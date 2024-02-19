import type { Meta, StoryObj } from "@storybook/react";
import { SettledAuctionChart } from "modules/auction/settled-auction-chart";
import { mockAuction } from "../mocks/auction";

const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

const meta = {
  title: "Auctions/SettledAuctionChart",
  component: SettledAuctionChart,
  args: {},
} satisfies Meta<typeof SettledAuctionChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
