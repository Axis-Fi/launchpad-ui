export type Address = `0x${string}`;

export type AxisContractNames =
  | "auctionHouse"
  | "catalogue"
  | "localSealedBidBatchAuction"
  | "linearVesting"
  | "permit2";

export type AxisContractAddresses = Record<AxisContractNames, Address>;
export type AxisContractAbis = Record<AxisContractNames, unknown>;

export type AxisContracts = Record<
  number,
  Record<AxisContractNames, { address: Address; abi: unknown[] }>
>;
