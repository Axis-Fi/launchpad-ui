export type Address = `0x${string}`;

export type AxisCoreContractNames =
  | "atomicAuctionHouse"
  | "atomicCatalogue"
  | "batchAuctionHouse"
  | "batchCatalogue";

export type AxisModuleContractNames =
  | "encryptedMarginalPrice"
  | "fixedPriceSale";

export type AxisDerivativeContractNames =
  | "atomicLinearVesting"
  | "batchLinearVesting";

export type AxisContractNames =
  | AxisCoreContractNames
  | AxisModuleContractNames
  | AxisDerivativeContractNames;

export type AxisContractAddresses = Record<AxisContractNames, Address>;
export type AxisContractAbis = Record<AxisContractNames, unknown>;

export type AxisContracts = Record<
  number,
  Record<AxisContractNames, { address: Address; abi: unknown[] }>
>;
