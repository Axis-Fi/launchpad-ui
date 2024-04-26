import { blastSepolia } from "viem/chains";
import { AxisDeploymentConfig } from "../../src/types";

const config: AxisDeploymentConfig = {
  name: "blast-testnet",
  chain: blastSepolia,
  chainIconUrl: "/blast-logo.png",
  addresses: {
    atomicAuctionHouse: "0xaa000000F812284225Ec15cDB90419C468921814",
    batchAuctionHouse: "0xBA000000dAF253566F209323bE7E2e555eE36330",
    atomicCatalogue: "0x4CD540B726720d9f622f9ff9E78BDf831a472D92",
    batchCatalogue: "0x3896E3Ff997C91Dd43d8d26effC6Fdc5Ed0718B4",
    encryptedMarginalPrice: "0xe2141BAd93C70D3448Aa69180d6B6581E2166B63",
    fixedPriceSale: "0xEFd165C54CB0FC5141DA4fb43B04f457D8a5A3e5",
    atomicLinearVesting: "0xDE1314B9DBf7a7D1E7d50cf909BFce5891a1a9d8",
    batchLinearVesting: "0x71960135E7170B3369daF6Eaca6121456a0F8A48",
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
      mintable: true,
      decimals: 18,
      symbol: "WETH",
      name: "Wrapped Ether",
      address: "0x1095e2650accccc10daaac305b380f23158f1d94",
      logoURI:
        "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/WETH.png",
    },
  ],
};

export default config;
