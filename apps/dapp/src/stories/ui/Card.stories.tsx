import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@repo/ui";

const meta = {
  title: "Design System/Card",
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {};
