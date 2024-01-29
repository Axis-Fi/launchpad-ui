import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "@repo/ui";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Design System/Input",
  component: Input,
  args: {
    placeholder: "Placeholder text",
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {},
};

export const Labeled: Story = {
  args: {
    label: "Label",
  },
};
