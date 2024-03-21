import { modeTestnet } from "viem/chains";
import { AxisDeploymentConfig } from "../../src/types";

const config: AxisDeploymentConfig = {
  chain: modeTestnet,
  addresses: {
    auctionHouse: "0x0000000053307d4Ec2141c8b49fff0A04903F11D",
    catalogue: "0x76d2932BE90F1AEd4B7aACeFed9AC8B8b712c8bf",
    empam: "0x0407910809D251c2E4c217576b63f263e3Fd1B59",
    fpam: "0x605A7105CA51FD5F107258362f52d8269eeA851A",
    linearVesting: "0x6c80F20C5C0404a3D5349F71F9B25c0654884092",
  },
  rpcURL: "https://sepolia.mode.network",
  tokenList: [],
};

export default config;
