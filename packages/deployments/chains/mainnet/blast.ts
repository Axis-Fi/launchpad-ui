import { blast } from "viem/chains";
import { AxisDeploymentConfig } from "../../src/types";

// TODO: this isn't a real deployment config, just a placeholder
const config: AxisDeploymentConfig = {
  name: "blast",
  chain: blast,
  chainIconUrl: "/blast-logo.png",
  addresses: {
    auctionHouse: "0x000000009DB7a64d0B3f92E2F0e026a2AF9Cf9b3",
    catalogue: "0xc94404218178149EBeBfc1F47f0DF14B5FD881C5",
    empam: "0xF3e2578C66071a637F06cc02b1c11DeC0784C1A6",
    fpam: "0x9f3a5566AB27F79c0cF090f70FFc73B7F9962b36",
    linearVesting: "0xDe6D096f14812182F434D164AD6d184cC9A150Fd",
  },
  subgraphURL:
    "https://api.goldsky.com/api/public/project_clu16lu24lqh201x9f0qh135t/subgraphs/axis-origin-blast-sepolia/<VERSION>/gn",
  rpcURL:
    "https://broken-magical-hill.blast-sepolia.quiknode.pro/3bdd9ff197592ef9652987ef7dcf549e759c713d/",
  tokenList: [
    {
      mintable: true,
      decimals: 18,
      symbol: "USDB",
      name: "Blast USD",
      address: "0x4300000000000000000000000000000000000003",
      logoURI:
        "https://assets-global.website-files.com/65a6baa1a3f8ed336f415cb4/65c67eafd3569b7e2f834b8d_usdb-icon-yellow.svg",
    },
    {
      mintable: true,
      decimals: 18,
      symbol: "WETH",
      name: "Wrapped Ether",
      address: "0x4300000000000000000000000000000000000004",
      logoURI:
        "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/WETH.png",
    },
  ],
};

export default config;
