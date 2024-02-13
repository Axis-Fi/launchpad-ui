import { SubgraphAuctionWithEvents } from "loaders/subgraphTypes";

//TODO: move this
export type PropsWithAuction = {
  auction: SubgraphAuctionWithEvents;
};

export * from "./create-auction-submitter";
