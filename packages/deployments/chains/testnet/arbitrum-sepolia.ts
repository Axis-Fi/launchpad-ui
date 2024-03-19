import { arbitrumSepolia } from "viem/chains";
import { AxisDeploymentConfig } from "../../src/types";

const config: AxisDeploymentConfig = {
  chain: arbitrumSepolia,
  addresses: {
    auctionHouse: "0x0000000018430CdB845Ac2fa1CF883a6D94E5ee7",
    catalogue: "0xA9AEAe1d42bbfa591F4a06945a895d75011bE6e8",
    empam: "0xe6c04Ce6ca70eeE60bEc40E2e6e62958D91E02CC",
    fpam: "0x63Fb97Dd80060cFd70c87Aa54F594F3988B6Fc66",
    linearVesting: "0x884E32d3c9D60962EF1A005f3d5365a41CDE38b8",
  },
  rpcURL:
    "https://arb-sepolia.g.alchemy.com/v2/a7a38HEWAID2ovEpz8ONjO6JwIPyaTOq",
  tokenList: [
    {
      address: "0x6Cec0Ba158fd0C8BC48eafa11f8560318B32258D",
      name: "Olympus",
      symbol: "OHM",
      logoURI:
        "https://assets.coingecko.com/coins/images/14483/large/token_OHM_%281%29.png",
      decimals: 9,
    },
    {
      address: "0xcA93c9BFaC39efC5b069066a0970c3036C3029c9",
      name: "DAI",
      symbol: "DAI",
      logoURI:
        "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/DAI.png",
      decimals: 18,
    },
  ],
};

export default config;
