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
export const Variants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-3 bg-black p-5">
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button size="sm">Sm</Button>
      <Button size="lg">Lg</Button>
      <Button size="icon">Icon</Button>
    </div>
  ),
};
