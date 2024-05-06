import { blastSepolia } from "viem/chains";
import { AxisDeploymentConfig } from "../../src/types";

const config: AxisDeploymentConfig = {
  name: "blast-testnet",
  chain: blastSepolia,
  chainIconUrl: "/blast-logo.png",
  addresses: {
    atomicAuctionHouse: "0xAA000000721026c5B83e3b3d969DC5A7Dac20B7F",
    batchAuctionHouse: "0xBA00000073E5050EE216afbcE08ca4666DB37232",
    atomicCatalogue: "0xEa25Ea0EC643826Ac99077c84934FEee3B735332",
    batchCatalogue: "0x963385faC528159E0771091e656De5666e8A0776",
    encryptedMarginalPrice: "0x8dA4D2f56d6f353E36220f567221aD4e1E84cB04",
    fixedPriceSale: "0x296Dc8a6d40D819bFE7E4da7133961C8B007FC42",
    atomicLinearVesting: "0xfF0FE629C1a515437A9c939509769A7b6842778f",
    batchLinearVesting: "0x58F17242Ab609c7561fe72Dc89b6A56999e227Cd",
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
