import type { Meta, StoryObj } from "@storybook/react";
import { MutationDialog } from "src/modules/transactions/mutation-dialog";

const meta = {
  title: "Transactions/MutationDialog",
  component: MutationDialog,
} satisfies Meta<typeof MutationDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    mutation: {
      status: "idle",
      isIdle: false,
      isError: false,
      isPending: false,
      isSuccess: false,
    },
  },
};
