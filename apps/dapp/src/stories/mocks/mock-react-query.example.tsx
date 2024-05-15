/*
import { hashFn } from "wagmi/query";
import type { Meta, StoryObj } from "@storybook/react";
import { SettledAuctionChart } from "modules/auction/settled-auction-chart";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryKeyHashFn: hashFn,
      staleTime: Infinity,
      refetchOnMount: true,
    },
  },
});


const meta = {
  title: "Auctions/Whatever",
  component: Whatever,
  args: {
    auction: getSubgraphAuctionMock(),
  },
  decorators: [
    Story => {
      queryClient.setQueryData([
        "readContract",
        {
          "address": "0x96B52Ab3e5CAc0BbF49Be5039F2f9ef5d53bD322",
          "functionName": "auctionData",
          "args": [
            "1"
          ],
          "chainId": 168587773
        }
      ], meta.args.auction);

      return (
        <QueryClientProvider client={queryClient}>
          <div className="w-[800px]">
            <Story />
          </div>
        </QueryClientProvider>
      )
    }
  ]
} satisfies Meta<typeof SettledAuctionChart>;

export default meta;
type Story = StoryObj<typeof SettledAuctionChart>;

export const Primary: Story = {};
*/
