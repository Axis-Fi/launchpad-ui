import type { Meta, StoryObj } from "@storybook/react";
import { ComboBox } from "@repo/ui";
import { Primary as SelectStory } from "./Select.stories";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Design System/ComboBox",
  component: ComboBox,
  args: {
    placeholder: "Select one",
    options: SelectStory.args?.options,
  },
} satisfies Meta<typeof ComboBox>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {},
};
