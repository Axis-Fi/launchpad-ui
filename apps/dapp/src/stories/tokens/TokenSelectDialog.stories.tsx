import type { Meta, StoryObj } from "@storybook/react";
import { TokenSelectDialog } from "modules/token/token-select-dialog";
import { testnetList } from "@repo/deployments";

const tokens = testnetList[0].tokenList;

const meta = {
  title: "Tokens/TokenSelectDialog",
  component: TokenSelectDialog,
  args: {
    tokens,
  },
} satisfies Meta<typeof TokenSelectDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
