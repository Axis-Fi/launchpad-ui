import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "@repo/ui";

const meta = {
  title: "Design System/Card",
  component: Card,
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    title: "Haii",
    description: "Wen tokenlist?",
    children: <div className="h-[80px] text-center">im inside a card</div>,
    footer: "Haii from footer",
  },
};
