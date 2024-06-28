export type Address = `0x${string}`;

export type AxisCoreContractNames = "batchAuctionHouse" | "batchCatalogue";

export type AxisModuleContractNames =
  | "encryptedMarginalPrice"
  | "fixedPriceBatch";

export type AxisDerivativeContractNames = "batchLinearVesting";

export type AxisContractNames =
  | AxisCoreContractNames
  | AxisModuleContractNames
  | AxisDerivativeContractNames;

export type AxisCallbackNames =
  | "tokenAllowlist"
  | "merkleAllowlist"
  | "cappedMerkleAllowlist"
  | "allocatedMerkleAllowlist"
  | "uniV2Dtl"
  | "uniV3Dtl";

export type AxisContractAddresses = Record<AxisContractNames, Address>;
export type AxisCallbackAddresses = Record<AxisCallbackNames, Address>;

export type AxisContractAbis = Record<AxisContractNames, unknown>;

type Contract = { address: Address; abi: unknown[] };

export type AxisContracts = Record<
  number,
  Record<AxisContractNames, Contract> &
    //TODO: review, callbacks were made partial for development
    Partial<Record<AxisCallbackNames, Contract>>
>;
