import { blastSepolia } from "viem/chains";
import { AxisDeploymentConfig } from "../../src/types";
import { weth } from "../../tokens/common";

const config: AxisDeploymentConfig = {
  name: "blast-testnet",
  chain: blastSepolia,
  chainIconUrl: "/blast-logo.png",
  addresses: {
    atomicAuctionHouse: "0xAA0000E35F2042621ff29B2f3d0F89665f896502",
    batchAuctionHouse: "0xBA00001Bd857EFd2dF10Da01DFe3a97CFa836Cc9",
    atomicCatalogue: "0x5Ec85e475B3BeDE1280907B0ac568b406fBC543A",
    batchCatalogue: "0x7F6Af3993d64cbC3A97617C98A2BCe03c1f5Ec30",
    encryptedMarginalPrice: "0x96B52Ab3e5CAc0BbF49Be5039F2f9ef5d53bD322",
    fixedPriceSale: "0x3661B7704F7032103B3122C7796B5E03fAC715b5",
    atomicLinearVesting: "0x8270f3e8D874De8b974A0Bf928abDFf92171B1b2",
    batchLinearVesting: "0xFb1B55504E6f996D192f1F1B8fDfD4E987355552",
  },
  callbacks: {
    merkleAllowlist: "0x98680694236fFc2CC9Ca26De4Dd455AacBDe0297",
    cappedMerkleAllowlist: "0x98bfE4Ca49380A394d66aA7a4162085d2D1832C1",
    tokenAllowlist: "0x9817CAedCB15Ea8cc7146ac84344A05a89654cDB",
    dtlUniV2: "0x",
    dtlUniV3: "0x",
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
