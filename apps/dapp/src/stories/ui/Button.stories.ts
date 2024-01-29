import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@repo/ui";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Design System/Button",
  component: Button,
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    children: "button",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "button",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "button",
  },
};
