export const abi = [
  {
    name: "AuctionDataParams",
    internalType: "struct AuctionDataParams",
    type: "tuple",
    components: [
      { name: "price", type: "uint256" },
      { name: "minFillPercent", type: "uint24" },
    ],
  },
] as const;
