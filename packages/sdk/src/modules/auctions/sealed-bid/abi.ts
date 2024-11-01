export const abi = [
  {
    name: "AuctionDataParams",
    internalType: "struct AuctionDataParams",
    type: "tuple",
    components: [
      { name: "minPrice", type: "uint256" },
      { name: "minFillPercent", type: "uint24" },
      { name: "minBidSize", type: "uint256" },
      {
        name: "publicKey",
        internalType: "struct Point",
        type: "tuple",
        components: [
          { name: "x", internalType: "uint256", type: "uint256" },
          { name: "y", internalType: "uint256", type: "uint256" },
        ],
      },
    ],
  },
] as const;
