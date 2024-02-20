import type { Meta, StoryObj } from "@storybook/react";
import { TransactionHashCard } from "modules/transaction/transaction-hash-card";

const meta = {
  title: "Transactions/TransactionPendingDialog",
  component: TransactionHashCard,
} satisfies Meta<typeof TransactionHashCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    hash: "0x12341234",
    chainId: 168587773,
  },
};

export const Error: Story = {
  args: {
    ...Primary.args,
    error: {
      name: "Probe Underflow",
      message: "Needs to construct additional pylons",
    },
  },
};
