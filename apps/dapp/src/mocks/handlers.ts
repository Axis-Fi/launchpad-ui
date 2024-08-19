import { graphql, HttpResponse } from "msw";
import { stubGetAuctionLotsQuery } from "./stubs/get-auction-lots-query";
import { stubGetBatchAuctionLotQuery } from "./stubs/get-batch-auction-lot-query";

export const handlers = [
  graphql.query("getAuctionLots", () => {
    return HttpResponse.json({ data: stubGetAuctionLotsQuery() });
  }),
  graphql.query("getBatchAuctionLot", ({ variables }) => {
    const id = variables?.id;
    const lotId = id.substring(id.lastIndexOf("-") + 1);

    return HttpResponse.json({
      data: stubGetBatchAuctionLotQuery({ id, lotId }),
    });
  }),
];
