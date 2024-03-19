import { blastSepolia } from "viem/chains";
import { AxisDeploymentConfig } from "../../src/types";

const config: AxisDeploymentConfig = {
  chain: blastSepolia,
  addresses: {
    auctionHouse: "0x000000008D5D105e7e35483B4c03160761A2De5D",
    catalogue: "0x742485f9E2de202C5B0a2D540cac6d927FDE230f",
    empam: "0xe1B83edA3399A2c9B8265215EA21042C9b918dc5",
    fpam: "0x311016478a50d928386d422d44494fb57f9E692b",
    linearVesting: "0xd13d64dD95F3DB8d1B3E1E65a1ef3F952ee1FC73",
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
