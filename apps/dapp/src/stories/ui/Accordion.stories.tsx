import type { Meta, StoryObj } from "@storybook/react";
import { Accordion } from "@repo/ui";

const meta = {
  title: "Design System/Accordion",
  component: Accordion,
  args: {
    data: [{ label: "Show Accordion", content: "LFG" }],
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
