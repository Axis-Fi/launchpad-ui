import type { Meta, StoryObj } from "@storybook/react";
import { CreateAuctionStatusCard } from "../../pages/create-auction-page";

const meta = {
  title: "Auctions/CreateAuctionStatusCard",
  component: CreateAuctionStatusCard,
} satisfies Meta<typeof CreateAuctionStatusCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const idle = {
  isPending: true,
  isIdle: true,
  isSuccess: false,
};

const pending = {
  isPending: true,
  isIdle: false,
};

const success = {
  isSuccess: true,
};
const error = {
  error: {
    message: "Something went wrong",
  },
};

export const Primary: Story = {
  args: {
    info: success,
    keypair: success,
    tx: error,
    txReceipt: idle,
  },
};
