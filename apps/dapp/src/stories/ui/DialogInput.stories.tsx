import type { Meta, StoryObj } from "@storybook/react";
import { DialogInput } from "@repo/ui";
import { Primary as SelectStory } from "./Select.stories";

const meta = {
  title: "Design System/DialogInput",
  component: DialogInput,
  args: {
    triggerContent: "Click to Pick",
    options: SelectStory.args?.options,
  },
} satisfies Meta<typeof DialogInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
