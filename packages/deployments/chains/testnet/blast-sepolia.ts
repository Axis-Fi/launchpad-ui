import { blastSepolia } from "viem/chains";
import { AxisDeploymentConfig } from "../../src/types";

const config: AxisDeploymentConfig = {
  chain: blastSepolia,
  addresses: {
    auctionHouse: "0x000000009DB7a64d0B3f92E2F0e026a2AF9Cf9b3",
    catalogue: "0xc94404218178149EBeBfc1F47f0DF14B5FD881C5",
    empam: "0xF3e2578C66071a637F06cc02b1c11DeC0784C1A6",
    fpam: "0x9f3a5566AB27F79c0cF090f70FFc73B7F9962b36",
    linearVesting: "0xDe6D096f14812182F434D164AD6d184cC9A150Fd",
  },
  rpcURL:
    "https://broken-magical-hill.blast-sepolia.quiknode.pro/3bdd9ff197592ef9652987ef7dcf549e759c713d/",
  tokenList: [
    {
      decimals: 18,
      symbol: "USDB",
      name: "Blast USD",
      address: "0x392a07f18CB3640fFd4E69D0c90DCe397b277813",
      logoURI:
        "https://assets-global.website-files.com/65a6baa1a3f8ed336f415cb4/65c67eafd3569b7e2f834b8d_usdb-icon-yellow.svg",
    },
    {
      decimals: 18,
      symbol: "BTK",
      name: "Base Token",
      address: "0xCA8C1163dC6aA7Ee376F00Cc77f1cbE01adfFC92",
    },
  ],
};

export default config;
