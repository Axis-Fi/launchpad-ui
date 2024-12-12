import type { Meta, StoryObj } from "@storybook/react";
import { getBatchAuctionMock } from "../mocks/batch-auction";
import { AuctionFailedClaimCard } from "modules/auction/claim-card/auction-failed-claim-card";
import { WagmiProvider, createConfig, http } from "wagmi";
import { ReactNode } from "react";
import { blastSepolia } from "wagmi/chains";
import { mock } from "wagmi/connectors";

const mockWallet = "0x0000000000000000000000000000000000000001";

const wagmiConfig = createConfig({
  chains: [blastSepolia],
  connectors: [
    mock({
      accounts: [mockWallet],
    }),
  ],
  transports: {
    [blastSepolia.id]: http(),
  },
});

const WagmiDecorator: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>;
};

const meta = {
  title: "Auctions/Bid Claim/Auction Failed",
  component: AuctionFailedClaimCard,
  args: {
    auction: getBatchAuctionMock(),
  },
  decorators: [
    (Story) => (
      <WagmiDecorator>
        <div className="flex w-[496px] items-start">
          <Story />
        </div>
      </WagmiDecorator>
    ),
  ],
} satisfies Meta<typeof AuctionFailedClaimCard>;

export default meta;

type Story = StoryObj<typeof meta>;

// TODO
// [ ] when raised amount is below minimum fill
// [ ] when the auction has not settled successfully
// [ ] when the user has not claimed
//  [ ] it shows a claim button
// [ ] when the user has claimed
//  [ ] it links to live auctions
// Can the wallet state be mimicked?
// Can the tx dialog be mimicked?

export const Default: Story = {};
