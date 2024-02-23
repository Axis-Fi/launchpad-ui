import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "@repo/ui";

const meta = {
  title: "Design System/Progress",
  component: Progress,
  args: {
    value: 50,
  },
  decorators: (Story) => (
    <div className="w-[180px]">
      <Story />
    </div>
  ),
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
