import {
  AuctionType,
  type Token,
  type Address,
  type Auction,
  type AxisContractNames,
  type AxisModuleContractNames,
} from "@repo/types";
import { testnetDeployments, mainnetDeployments, axisContracts } from ".";
import mainnetTokenList from "./mainnet-tokenlist.json";

const auctionHouseMap = {
  [AuctionType.SEALED_BID]: "batchAuctionHouse",
  [AuctionType.FIXED_PRICE_BATCH]: "batchAuctionHouse",
};

const catalogueMap = {
  [AuctionType.SEALED_BID]: "batchCatalogue",
  [AuctionType.FIXED_PRICE_BATCH]: "batchCatalogue",
};

const moduleMap = {
  [AuctionType.SEALED_BID]: "encryptedMarginalPrice",
  [AuctionType.FIXED_PRICE_BATCH]: "fixedPriceBatch",
};

function getContractsByModuleType(auction: Auction) {
  const auctionModule = moduleMap[
    auction.auctionType
  ] as AxisModuleContractNames;

  const abi = axisContracts.abis[auctionModule];
  const address = axisContracts.addresses[auction.chainId][auctionModule];

  if (!abi || !address) {
    throw new Error(`Can't find abi/address for ${auction.auctionType}`);
  }

  return { abi, address };
}

function getAuctionHouse(auction: Pick<Auction, "chainId" | "auctionType">) {
  //TODO: find a better way to handle this, see useAuction for usecase
  if (!auction.auctionType || !auction.chainId) {
    return {
      abi: axisContracts.abis.batchAuctionHouse,
      address: "0x" as Address,
    };
  }
  const contractName = auctionHouseMap[
    auction.auctionType
  ] as AxisContractNames;

  return {
    abi: axisContracts.abis[contractName],
    address: axisContracts.addresses[auction.chainId][contractName] as Address,
  };
}

function getCatalogue(auction: Pick<Auction, "chainId" | "auctionType">) {
  const catalogueName = catalogueMap[auction.auctionType] as AxisContractNames;
  const abi = axisContracts.abis[catalogueName];
  const address = axisContracts.addresses[auction.chainId][
    catalogueName
  ] as Address;

  if (!abi || !address) {
    return undefined;
  }

  return {
    abi,
    address,
  };
}

const isTestnet = (chainId: number): boolean =>
  testnetDeployments.find((testnet) => testnet.chain.id === chainId) !==
  undefined;

const mainnetTokens = mainnetTokenList.tokens;

const getMainnetTokenFromSymbol = (tokenSymbol: string): Token | undefined => {
  return mainnetTokens.find((token) => token.symbol === tokenSymbol) as
    | Token
    | undefined;
};

/** Gets a deployment configuration by chain id*/
function getDeploymentConfiguration(chainId: number) {
  return [mainnetDeployments, testnetDeployments]
    .flat()
    .find((d) => d.chain.id === chainId);
}

export {
  getContractsByModuleType,
  getAuctionHouse,
  getCatalogue,
  isTestnet,
  getMainnetTokenFromSymbol,
  getDeploymentConfiguration as getDeployment,
};
