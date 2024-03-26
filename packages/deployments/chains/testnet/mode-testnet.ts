import { modeTestnet } from "viem/chains";
import { AxisDeploymentConfig } from "../../src/types";

const config: AxisDeploymentConfig = {
  name: "mode-testnet",
  chain: modeTestnet,
  chainIconUrl: "/mode-logo.svg",
  addresses: {
    auctionHouse: "0x0000000053307d4Ec2141c8b49fff0A04903F11D",
    catalogue: "0x76d2932BE90F1AEd4B7aACeFed9AC8B8b712c8bf",
    empam: "0x0407910809D251c2E4c217576b63f263e3Fd1B59",
    fpam: "0x605A7105CA51FD5F107258362f52d8269eeA851A",
    linearVesting: "0x6c80F20C5C0404a3D5349F71F9B25c0654884092",
  },
  subgraphURL:
    "https://api.goldsky.com/api/public/project_clu16lu24lqh201x9f0qh135t/subgraphs/axis-origin-mode-testnet/<VERSION>/gn",
  rpcURL: "https://sepolia.mode.network",
  tokenList: [
    {
      name: "Test Token 1",
      symbol: "TT1",
      address: "0xBFfBef6f8a0Ef38121716860E2Ff824c018a467d",
      decimals: 18,
    },
    {
      name: "Test Token 2",
      symbol: "TT2",
      address: "0x16D5Aab9d35f8B3ac7BD086eEDcCe5343682D5F0",
      decimals: 18,
    },
  ],
};

export default config;
