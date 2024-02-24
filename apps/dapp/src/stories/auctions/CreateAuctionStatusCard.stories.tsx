import type { Meta, StoryObj } from "@storybook/react";
import { AuctionCreationStatus } from "../../modules/auction/auction-creation-status";

const meta = {
  title: "Auctions/CreateAuctionStatusCard",
  component: AuctionCreationStatus,
  decorators: (Story) => (
    <div className="w-[300px]">
      <Story />
    </div>
  ),
} satisfies Meta<typeof AuctionCreationStatus>;

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
