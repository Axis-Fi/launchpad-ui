import type { Meta, StoryObj } from "@storybook/react";
import { RequiresApproval } from "modules/token/requires-approval";

const meta = {
  title: "Tokens/RequiresApproval",
  component: RequiresApproval,
  args: {},
} satisfies Meta<typeof RequiresApproval>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const WithPermit2: Story = {
  args: {
    withPermit2Enabled: true,
  },
};
