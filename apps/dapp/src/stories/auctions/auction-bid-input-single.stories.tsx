import { activeChains } from "@repo/env/src/chains";
import { Meta, StoryObj } from "@storybook/react";
import { getBatchAuctionMock } from "../mocks/batch-auction";
import { AuctionBidInputSingle } from "modules/auction/auction-bid-input-single";
import { BidForm } from "modules/auction/status";
import { useForm, FormProvider } from "react-hook-form";

const form = useForm<BidForm>({
  mode: "onTouched",
});
const defaultArgs = {
  auction: getBatchAuctionMock(),
  form: form,
  balance: 100,
};

const meta = {
  title: "Auctions/Bid Input Single",
  args: defaultArgs,
  component: AuctionBidInputSingle,
  decorators: [
    (Story) => (
      <FormProvider {...form}>
        <Story />
      </FormProvider>
    ),
  ],
} satisfies Meta<typeof AuctionBidInputSingle>;

export default meta;

type Story = StoryObj<typeof AuctionBidInputSingle>;

export const Default: Story = {};
