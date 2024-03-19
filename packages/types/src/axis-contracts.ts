export type Address = `0x${string}`;

export type AxisContractNames =
  | "auctionHouse"
  | "catalogue"
  | "empam"
  | "fpam"
  | "linearVesting";

export type AxisContractAddresses = Record<AxisContractNames, Address>;
export type AxisContractAbis = Record<AxisContractNames, unknown>;

export type AxisContracts = Record<
  number,
  Record<AxisContractNames, { address: Address; abi: unknown[] }>
>;
