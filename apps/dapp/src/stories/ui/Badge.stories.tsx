import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "@repo/ui";

const meta = {
  title: "Design System/Badge",
  component: Badge,
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "CURATOR",
  },
};

export const Round: Story = {
  args: {
    children: 70,
    size: "round",
    variant: "destructive",
  },
};
