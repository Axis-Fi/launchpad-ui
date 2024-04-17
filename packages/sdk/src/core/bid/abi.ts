const AUCTION_DATA_TYPE_ABI = [
  { name: "encryptedBid", type: "uint256" },
  {
    name: "bidPublicKey",
    type: "tuple",
    internalType: "struct Point",
    components: [
      {
        name: "x",
        type: "uint256",
      },
      {
        name: "y",
        type: "uint256",
      },
    ],
  },
];

export { AUCTION_DATA_TYPE_ABI };
