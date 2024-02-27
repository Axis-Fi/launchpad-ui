import { blastSepolia } from "viem/chains";
import { AxisDeploymentConfig } from "../../src/types";

const config: AxisDeploymentConfig = {
  chain: blastSepolia,
  addresses: {
    auctionHouse: "0x00000000cB3c2A36dEF5Be4d3A674280eFC33498",
    catalogue: "0x0A0BA689D2D72D3f376293c534AF299B3C6Dac85",
    localSealedBidBatchAuction: "0xcE56d3E3E145b44597B61E99c64cb82FB209Da04",
    linearVesting: "0x32A7b69B9F42F0CD6306Bd897ae2664AF0eFBAbd",
  },
  rpcURL:
    "https://broken-magical-hill.blast-sepolia.quiknode.pro/3bdd9ff197592ef9652987ef7dcf549e759c713d/",
  tokenList: [
    {
      decimals: 18,
      symbol: "USDB",
      address: "0x392a07f18CB3640fFd4E69D0c90DCe397b277813",
      logoURI:
        "https://assets-global.website-files.com/65a6baa1a3f8ed336f415cb4/65c67eafd3569b7e2f834b8d_usdb-icon-yellow.svg",
    },
  ],
};

export default config;
