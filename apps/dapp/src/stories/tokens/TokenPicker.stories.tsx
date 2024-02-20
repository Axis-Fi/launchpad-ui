import type { Meta, StoryObj } from "@storybook/react";
import { TokenPicker } from "modules/token/token-picker";
import { mockAuction } from "../mocks/auction";

const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

const meta = {
  title: "Tokens/TokenPicker",
  component: TokenPicker,
  args: {
    auction: mockAuction,
  },
  decorators: [
    (Story) => (
      <div className="w-[420px] p-4">
        <Story />{" "}
      </div>
    ),
  ],
} satisfies Meta<typeof TokenPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
