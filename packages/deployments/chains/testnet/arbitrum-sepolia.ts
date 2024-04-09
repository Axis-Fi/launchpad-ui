import { arbitrumSepolia } from "viem/chains";
import { AxisDeploymentConfig } from "../../src/types";

const config: AxisDeploymentConfig = {
  name: "arbitrum-sepolia",
  chain: arbitrumSepolia,
  chainIconUrl:
    "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/chains/ARBITRUM.png",
  addresses: {
    auctionHouse: "0x00000000dca78197E4B82b17AFc5C263a097ef3e",
    catalogue: "0x0407910809D251c2E4c217576b63f263e3Fd1B59",
    empam: "0x605A7105CA51FD5F107258362f52d8269eeA851A",
    fpam: "0x6c80F20C5C0404a3D5349F71F9B25c0654884092",
    linearVesting: "0xaC9957282BeA578f371078ddc4cD12A135B105d6",
  },
  subgraphURL:
    "https://subgraph.satsuma-prod.com/44c4cc082f74/spaces-team/axis-origin-arbitrum-sepolia/version/v<VERSION>/api",
  rpcURL:
    "https://arb-sepolia.g.alchemy.com/v2/a7a38HEWAID2ovEpz8ONjO6JwIPyaTOq",
  tokenList: [
    {
      name: "Test Token 1",
      symbol: "TT1",
      address: "0x16D5Aab9d35f8B3ac7BD086eEDcCe5343682D5F0",
      decimals: 18,
      mintable: true,
    },

    {
      address: "0xb5973cabd553f34c32ae2fbc91c94b3bf76db62e",
      name: "Test Token2",
      symbol: "TT2",
      logoURI:
        "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/DAI.png",
      decimals: 18,
      mintable: true,
    },
  ],
};

export default config;
