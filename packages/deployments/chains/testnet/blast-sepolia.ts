import { blastSepolia } from "viem/chains";
import { AxisDeploymentConfig } from "../../src/types";
import { weth } from "../../tokens/common";

const config: AxisDeploymentConfig = {
  name: "blast-testnet",
  chain: blastSepolia,
  chainIconUrl: "/blast-logo.png",
  addresses: {
    batchAuctionHouse: "0xBA00007A1868f4AEFdd39041327CbC4Ba5bF1632",
    batchCatalogue: "0xC6D5E3A1823304D28cdc6dc23b4117b6cA34C98E",
    encryptedMarginalPrice: "0x8F34bBB3edd28017f826FE7a73eb9297384BF0d8",
    fixedPriceBatch: "0x87ED152099949F870725bD9517A1697d428ddF74",
    batchLinearVesting: "0xBD0474b8e7b65f3dF35d2817BA09aC864a199e31",
  },
  callbacks: {
    cappedMerkleAllowlist: "0x981d6a6997B23C06f4E95862f72B7C06c039a647",
    merkleAllowlist: "0x9859c6FA2594e93149bd76415cE3982f39888CCb",
    tokenAllowlist: "0x984B6165fC87c682441E81B4aa23A017cdbFba18",
    allocatedMerkleAllowlist: "0x986455Ab4f64303E8F51e72F6BF1789182563F65",
    uniV2Dtl: "0xE60007A0721A92f0eb538c360317d4808238700D",
    uniV3Dtl: "0xE6b1113d108f86Fb7eF662ecF235dB6dB8978Cc3",
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
      address: "0x47F12ccE28D1A2ac9184777fa8a993C6067Df728",
      logoURI:
        "https://assets-global.website-files.com/65a6baa1a3f8ed336f415cb4/65c67eafd3569b7e2f834b8d_usdb-icon-yellow.svg",
    },
    {
      ...weth,
      mintable: true,
      decimals: 18,
      address: "0x1095e2650accccc10daaac305b380f23158f1d94",
    },
    {
      decimals: 18,
      symbol: "SLO",
      name: "SLO Token",
      address: "0xB24D0b6ae015DC6fd279E330db101bB890d8060c",
    },
  ],
};

export default config;
