import { Meta, StoryObj } from "@storybook/react";
import { getFixedPriceBatchAuctionMock } from "../mocks/batch-auction";
import { AuctionBidInputSingle } from "modules/auction/auction-bid-input-single";
import { BidForm } from "modules/auction/status";
import { useForm, FormProvider } from "react-hook-form";
import { ReactNode } from "react";
import { Card } from "@repo/ui";

const StorybookFormProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const form = useForm<BidForm>({
    mode: "onTouched",
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={(e) => e.preventDefault()}>{children}</form>
    </FormProvider>
  );
};

const defaultAuction = {
  ...getFixedPriceBatchAuctionMock(),
};

const defaultArgs = {
  auction: defaultAuction,
  balance: 100,
};

const meta = {
  title: "Auctions/Bid Input Single",
  args: defaultArgs,
  component: AuctionBidInputSingle,
  decorators: [
    (Story) => (
      <StorybookFormProvider>
        <Card>
          <Story />
        </Card>
      </StorybookFormProvider>
    ),
  ],
} satisfies Meta<typeof AuctionBidInputSingle>;

export default meta;

type Story = StoryObj<typeof AuctionBidInputSingle>;

export const BalanceZero: Story = {
  args: {
    balance: 0,
  },
};

// TODO:
// [ ] No balance
// [ ] No limit
// [ ] Limit defined
// [ ] Input amount more than remaining capacity
// [ ] Input amount less than remaining capacity
