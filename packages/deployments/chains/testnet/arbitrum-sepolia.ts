import { arbitrumSepolia } from "viem/chains";
import { AxisDeploymentConfig } from "../../src/types";

const config: AxisDeploymentConfig = {
  name: "arbitrum-sepolia",
  chain: arbitrumSepolia,
  addresses: {
    auctionHouse: "0x884E32d3c9D60962EF1A005f3d5365a41CDE38b8",
    catalogue: "0x0407910809D251c2E4c217576b63f263e3Fd1B59",
    empam: "0x605A7105CA51FD5F107258362f52d8269eeA851A",
    fpam: "0x6c80F20C5C0404a3D5349F71F9B25c0654884092",
    linearVesting: "0xaC9957282BeA578f371078ddc4cD12A135B105d6",
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
