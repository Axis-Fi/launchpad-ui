import type { BatchAuctionBid } from "@repo/types";

const getSettledAuctionPartialFillBidsMock = () =>
  [
    {
      amountIn: "33333",
      bidId: "1",
      bidder: "0x42bcbd46433e143874e0b705669a0ecde7b79ac4",
      blockTimestamp: "1715263804",
      claimed: {
        id: "blast-sepolia-0xba00001bd857efd2df10da01dfe3a97cfa836cc9-0-1",
      },
      date: "2024-05-09T14:10:04.000Z",
      outcome: "won",
      rawAmountIn: "33333000000000000000000",
      rawAmountOut: "10000000000000000000000",
      rawMarginalPrice: null,
      rawSubmittedPrice: "3333300000000000001",
      referrer: "0x0000000000000000000000000000000000000000",
      settledAmountIn: "33333",
      settledAmountInRefunded: "0",
      settledAmountOut: "29999.699999999999976",
      status: "claimed",
      submittedPrice: "3.333300000000000001",
    },
    {
      amountIn: "12345.6789",
      bidId: "2",
      bidder: "0x42bcbd46433e143874e0b705669a0ecde7b79ac4",
      blockTimestamp: "1715263914",
      claimed: {
        id: "blast-sepolia-0xba00001bd857efd2df10da01dfe3a97cfa836cc9-0-2",
      },
      date: "2024-05-09T14:11:54.000Z",
      outcome: "won",
      rawAmountIn: "12345678900000000000000",
      rawAmountOut: "5432100000000000000000",
      rawMarginalPrice: null,
      rawSubmittedPrice: "2272726735516651019",
      referrer: "0x0000000000000000000000000000000000000000",
      settledAmountIn: "12345.6789",
      settledAmountInRefunded: "0",
      settledAmountOut: "11111.111009999999991111",
      status: "claimed",
      submittedPrice: "2.272726735516651019",
    },
    {
      amountIn: "56789.123456789",
      bidId: "3",
      bidder: "0x42bcbd46433e143874e0b705669a0ecde7b79ac4",
      blockTimestamp: "1715263960",
      claimed: {
        id: "blast-sepolia-0xba00001bd857efd2df10da01dfe3a97cfa836cc9-0-3",
      },
      date: "2024-05-09T14:12:40.000Z",
      outcome: "won",
      rawAmountIn: "56789123456789000000000",
      rawAmountOut: "23456789000000000000000",
      rawMarginalPrice: null,
      rawSubmittedPrice: "2421010115953594501",
      referrer: "0x0000000000000000000000000000000000000000",
      settledAmountIn: "56789.123456789",
      settledAmountInRefunded: "0",
      settledAmountOut: "51110.211111110099959111",
      status: "claimed",
      submittedPrice: "2.421010115953594501",
    },
    {
      amountIn: "100000",
      bidId: "4",
      bidder: "0x42bcbd46433e143874e0b705669a0ecde7b79ac4",
      blockTimestamp: "1715263988",
      claimed: {
        id: "blast-sepolia-0xba00001bd857efd2df10da01dfe3a97cfa836cc9-0-4",
      },
      date: "2024-05-09T14:13:08.000Z",
      outcome: "won - partial fill",
      rawAmountIn: "100000000000000000000000",
      rawAmountOut: "90000000000000000000000",
      rawMarginalPrice: null,
      rawSubmittedPrice: "1111111111111111112",
      referrer: "0x0000000000000000000000000000000000000000",
      settledAmountIn: "8643.308754322111200001",
      settledAmountInRefunded: "91356.691245677888799999",
      settledAmountOut: "7778.977878889900073777",
      status: "claimed",
      submittedPrice: "1.111111111111111112",
    },
  ] satisfies BatchAuctionBid[];

export { getSettledAuctionPartialFillBidsMock };
