import { useQuery, UseQueryOptions } from "@tanstack/react-query";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };

function fetcher<TData, TVariables>(query: string, variables?: TVariables) {
  return async (): Promise<TData> => {
    const res = await fetch(
      "https://api.studio.thegraph.com/query/65230/axisfi-auctions/0.0.13",
      {
        method: "POST",
        ...{ headers: { "Content-Type": "application/json" } },
        body: JSON.stringify({ query, variables }),
      },
    );

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0];

      throw new Error(message);
    }

    return json.data;
  };
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: string; output: string };
  Float: { input: string; output: string };
  BigDecimal: { input: string; output: string };
  BigInt: { input: string; output: string };
  Bytes: { input: string; output: string };
  Int8: { input: string; output: string };
};

export type AuctionCancelled = {
  auctionRef: Scalars["Bytes"]["output"];
  blockNumber: Scalars["BigInt"]["output"];
  blockTimestamp: Scalars["BigInt"]["output"];
  id: Scalars["Bytes"]["output"];
  lot: AuctionLot;
  transactionHash: Scalars["Bytes"]["output"];
};

export type AuctionCancelled_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<AuctionCancelled_Filter>>>;
  auctionRef?: InputMaybe<Scalars["Bytes"]["input"]>;
  auctionRef_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  auctionRef_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  auctionRef_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  auctionRef_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  auctionRef_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  auctionRef_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  auctionRef_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  auctionRef_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  auctionRef_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  blockNumber?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  id?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  id_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  lot?: InputMaybe<Scalars["String"]["input"]>;
  lot_?: InputMaybe<AuctionLot_Filter>;
  lot_contains?: InputMaybe<Scalars["String"]["input"]>;
  lot_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lot_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  lot_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lot_gt?: InputMaybe<Scalars["String"]["input"]>;
  lot_gte?: InputMaybe<Scalars["String"]["input"]>;
  lot_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  lot_lt?: InputMaybe<Scalars["String"]["input"]>;
  lot_lte?: InputMaybe<Scalars["String"]["input"]>;
  lot_not?: InputMaybe<Scalars["String"]["input"]>;
  lot_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  lot_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lot_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  lot_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lot_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  lot_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  lot_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lot_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  lot_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  or?: InputMaybe<Array<InputMaybe<AuctionCancelled_Filter>>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum AuctionCancelled_OrderBy {
  auctionRef = "auctionRef",
  blockNumber = "blockNumber",
  blockTimestamp = "blockTimestamp",
  Id = "id",
  Lot = "lot",
  lot__auctionRef = "lot__auctionRef",
  Lot__capacity = "lot__capacity",
  lot__capacityInQuote = "lot__capacityInQuote",
  lot__capacityInitial = "lot__capacityInitial",
  Lot__chain = "lot__chain",
  Lot__conclusion = "lot__conclusion",
  lot__createdBlockNumber = "lot__createdBlockNumber",
  lot__createdBlockTimestamp = "lot__createdBlockTimestamp",
  lot__createdTransactionHash = "lot__createdTransactionHash",
  Lot__curator = "lot__curator",
  lot__curatorApproved = "lot__curatorApproved",
  lot__derivativeRef = "lot__derivativeRef",
  Lot__id = "lot__id",
  lot__lastUpdatedBlockNumber = "lot__lastUpdatedBlockNumber",
  lot__lastUpdatedBlockTimestamp = "lot__lastUpdatedBlockTimestamp",
  lot__lastUpdatedTransactionHash = "lot__lastUpdatedTransactionHash",
  lot__lotId = "lot__lotId",
  Lot__owner = "lot__owner",
  Lot__purchased = "lot__purchased",
  Lot__sold = "lot__sold",
  Lot__start = "lot__start",
  lot__wrapDerivative = "lot__wrapDerivative",
  transactionHash = "transactionHash",
}

export type AuctionCreated = {
  blockNumber: Scalars["BigInt"]["output"];
  blockTimestamp: Scalars["BigInt"]["output"];
  id: Scalars["Bytes"]["output"];
  infoHash: Scalars["String"]["output"];
  lot: AuctionLot;
  transactionHash: Scalars["Bytes"]["output"];
};

export type AuctionCreated_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<AuctionCreated_Filter>>>;
  blockNumber?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  id?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  id_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  infoHash?: InputMaybe<Scalars["String"]["input"]>;
  infoHash_contains?: InputMaybe<Scalars["String"]["input"]>;
  infoHash_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  infoHash_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  infoHash_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  infoHash_gt?: InputMaybe<Scalars["String"]["input"]>;
  infoHash_gte?: InputMaybe<Scalars["String"]["input"]>;
  infoHash_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  infoHash_lt?: InputMaybe<Scalars["String"]["input"]>;
  infoHash_lte?: InputMaybe<Scalars["String"]["input"]>;
  infoHash_not?: InputMaybe<Scalars["String"]["input"]>;
  infoHash_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  infoHash_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  infoHash_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  infoHash_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  infoHash_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  infoHash_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  infoHash_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  infoHash_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  infoHash_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lot?: InputMaybe<Scalars["String"]["input"]>;
  lot_?: InputMaybe<AuctionLot_Filter>;
  lot_contains?: InputMaybe<Scalars["String"]["input"]>;
  lot_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lot_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  lot_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lot_gt?: InputMaybe<Scalars["String"]["input"]>;
  lot_gte?: InputMaybe<Scalars["String"]["input"]>;
  lot_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  lot_lt?: InputMaybe<Scalars["String"]["input"]>;
  lot_lte?: InputMaybe<Scalars["String"]["input"]>;
  lot_not?: InputMaybe<Scalars["String"]["input"]>;
  lot_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  lot_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lot_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  lot_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lot_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  lot_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  lot_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lot_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  lot_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  or?: InputMaybe<Array<InputMaybe<AuctionCreated_Filter>>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum AuctionCreated_OrderBy {
  blockNumber = "blockNumber",
  blockTimestamp = "blockTimestamp",
  Id = "id",
  infoHash = "infoHash",
  Lot = "lot",
  lot__auctionRef = "lot__auctionRef",
  Lot__capacity = "lot__capacity",
  lot__capacityInQuote = "lot__capacityInQuote",
  lot__capacityInitial = "lot__capacityInitial",
  Lot__chain = "lot__chain",
  Lot__conclusion = "lot__conclusion",
  lot__createdBlockNumber = "lot__createdBlockNumber",
  lot__createdBlockTimestamp = "lot__createdBlockTimestamp",
  lot__createdTransactionHash = "lot__createdTransactionHash",
  Lot__curator = "lot__curator",
  lot__curatorApproved = "lot__curatorApproved",
  lot__derivativeRef = "lot__derivativeRef",
  Lot__id = "lot__id",
  lot__lastUpdatedBlockNumber = "lot__lastUpdatedBlockNumber",
  lot__lastUpdatedBlockTimestamp = "lot__lastUpdatedBlockTimestamp",
  lot__lastUpdatedTransactionHash = "lot__lastUpdatedTransactionHash",
  lot__lotId = "lot__lotId",
  Lot__owner = "lot__owner",
  Lot__purchased = "lot__purchased",
  Lot__sold = "lot__sold",
  Lot__start = "lot__start",
  lot__wrapDerivative = "lot__wrapDerivative",
  transactionHash = "transactionHash",
}

export type AuctionLot = {
  auctionRef: Scalars["Bytes"]["output"];
  baseToken: Token;
  bids: Array<Bid>;
  bidsDecrypted: Array<BidDecrypted>;
  cancelled?: Maybe<AuctionCancelled>;
  capacity: Scalars["BigDecimal"]["output"];
  capacityInQuote: Scalars["Boolean"]["output"];
  capacityInitial: Scalars["BigDecimal"]["output"];
  chain: Scalars["String"]["output"];
  conclusion: Scalars["BigInt"]["output"];
  created: AuctionCreated;
  createdBlockNumber: Scalars["BigInt"]["output"];
  createdBlockTimestamp: Scalars["BigInt"]["output"];
  createdTransactionHash: Scalars["Bytes"]["output"];
  curated?: Maybe<Curated>;
  curator: Scalars["Bytes"]["output"];
  curatorApproved: Scalars["Boolean"]["output"];
  derivativeRef: Scalars["Bytes"]["output"];
  id: Scalars["String"]["output"];
  lastUpdatedBlockNumber: Scalars["BigInt"]["output"];
  lastUpdatedBlockTimestamp: Scalars["BigInt"]["output"];
  lastUpdatedTransactionHash: Scalars["Bytes"]["output"];
  lotId: Scalars["BigInt"]["output"];
  owner: Scalars["Bytes"]["output"];
  purchased: Scalars["BigDecimal"]["output"];
  purchases: Array<Purchase>;
  quoteToken: Token;
  refundedBids: Array<RefundBid>;
  settle?: Maybe<Settle>;
  sold: Scalars["BigDecimal"]["output"];
  start: Scalars["BigInt"]["output"];
  wrapDerivative: Scalars["Boolean"]["output"];
};

export type AuctionLotBidsArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Bid_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<Bid_Filter>;
};

export type AuctionLotBidsDecryptedArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<BidDecrypted_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<BidDecrypted_Filter>;
};

export type AuctionLotPurchasesArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Purchase_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<Purchase_Filter>;
};

export type AuctionLotRefundedBidsArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<RefundBid_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<RefundBid_Filter>;
};

export type AuctionLot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<AuctionLot_Filter>>>;
  auctionRef?: InputMaybe<Scalars["Bytes"]["input"]>;
  auctionRef_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  auctionRef_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  auctionRef_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  auctionRef_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  auctionRef_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  auctionRef_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  auctionRef_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  auctionRef_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  auctionRef_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  baseToken?: InputMaybe<Scalars["String"]["input"]>;
  baseToken_?: InputMaybe<Token_Filter>;
  baseToken_contains?: InputMaybe<Scalars["String"]["input"]>;
  baseToken_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  baseToken_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  baseToken_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  baseToken_gt?: InputMaybe<Scalars["String"]["input"]>;
  baseToken_gte?: InputMaybe<Scalars["String"]["input"]>;
  baseToken_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  baseToken_lt?: InputMaybe<Scalars["String"]["input"]>;
  baseToken_lte?: InputMaybe<Scalars["String"]["input"]>;
  baseToken_not?: InputMaybe<Scalars["String"]["input"]>;
  baseToken_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  baseToken_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  baseToken_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  baseToken_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  baseToken_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  baseToken_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  baseToken_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  baseToken_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  baseToken_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  bidsDecrypted_?: InputMaybe<BidDecrypted_Filter>;
  bids_?: InputMaybe<Bid_Filter>;
  cancelled_?: InputMaybe<AuctionCancelled_Filter>;
  capacity?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  capacityInQuote?: InputMaybe<Scalars["Boolean"]["input"]>;
  capacityInQuote_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  capacityInQuote_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  capacityInQuote_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  capacityInitial?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  capacityInitial_gt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  capacityInitial_gte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  capacityInitial_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
  capacityInitial_lt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  capacityInitial_lte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  capacityInitial_not?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  capacityInitial_not_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
  capacity_gt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  capacity_gte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  capacity_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
  capacity_lt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  capacity_lte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  capacity_not?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  capacity_not_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
  chain?: InputMaybe<Scalars["String"]["input"]>;
  chain_contains?: InputMaybe<Scalars["String"]["input"]>;
  chain_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  chain_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  chain_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  chain_gt?: InputMaybe<Scalars["String"]["input"]>;
  chain_gte?: InputMaybe<Scalars["String"]["input"]>;
  chain_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  chain_lt?: InputMaybe<Scalars["String"]["input"]>;
  chain_lte?: InputMaybe<Scalars["String"]["input"]>;
  chain_not?: InputMaybe<Scalars["String"]["input"]>;
  chain_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  chain_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  chain_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  chain_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  chain_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  chain_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  chain_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  chain_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  chain_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  conclusion?: InputMaybe<Scalars["BigInt"]["input"]>;
  conclusion_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  conclusion_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  conclusion_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  conclusion_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  conclusion_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  conclusion_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  conclusion_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  createdBlockNumber?: InputMaybe<Scalars["BigInt"]["input"]>;
  createdBlockNumber_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  createdBlockNumber_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  createdBlockNumber_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  createdBlockNumber_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  createdBlockNumber_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  createdBlockNumber_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  createdBlockNumber_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  createdBlockTimestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  createdBlockTimestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  createdBlockTimestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  createdBlockTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  createdBlockTimestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  createdBlockTimestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  createdBlockTimestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  createdBlockTimestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  createdTransactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  createdTransactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  createdTransactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  createdTransactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  createdTransactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  createdTransactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  createdTransactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  createdTransactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  createdTransactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  createdTransactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  created_?: InputMaybe<AuctionCreated_Filter>;
  curated_?: InputMaybe<Curated_Filter>;
  curator?: InputMaybe<Scalars["Bytes"]["input"]>;
  curatorApproved?: InputMaybe<Scalars["Boolean"]["input"]>;
  curatorApproved_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  curatorApproved_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  curatorApproved_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  curator_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  curator_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  curator_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  curator_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  curator_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  curator_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  curator_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  curator_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  curator_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  derivativeRef?: InputMaybe<Scalars["Bytes"]["input"]>;
  derivativeRef_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  derivativeRef_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  derivativeRef_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  derivativeRef_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  derivativeRef_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  derivativeRef_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  derivativeRef_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  derivativeRef_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  derivativeRef_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  id_contains?: InputMaybe<Scalars["String"]["input"]>;
  id_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  id_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id_gt?: InputMaybe<Scalars["String"]["input"]>;
  id_gte?: InputMaybe<Scalars["String"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id_lt?: InputMaybe<Scalars["String"]["input"]>;
  id_lte?: InputMaybe<Scalars["String"]["input"]>;
  id_not?: InputMaybe<Scalars["String"]["input"]>;
  id_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  id_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  id_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  id_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  id_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lastUpdatedBlockNumber?: InputMaybe<Scalars["BigInt"]["input"]>;
  lastUpdatedBlockNumber_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  lastUpdatedBlockNumber_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  lastUpdatedBlockNumber_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  lastUpdatedBlockNumber_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  lastUpdatedBlockNumber_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  lastUpdatedBlockNumber_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  lastUpdatedBlockNumber_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  lastUpdatedBlockTimestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  lastUpdatedBlockTimestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  lastUpdatedBlockTimestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  lastUpdatedBlockTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  lastUpdatedBlockTimestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  lastUpdatedBlockTimestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  lastUpdatedBlockTimestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  lastUpdatedBlockTimestamp_not_in?: InputMaybe<
    Array<Scalars["BigInt"]["input"]>
  >;
  lastUpdatedTransactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  lastUpdatedTransactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  lastUpdatedTransactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  lastUpdatedTransactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  lastUpdatedTransactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  lastUpdatedTransactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  lastUpdatedTransactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  lastUpdatedTransactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  lastUpdatedTransactionHash_not_contains?: InputMaybe<
    Scalars["Bytes"]["input"]
  >;
  lastUpdatedTransactionHash_not_in?: InputMaybe<
    Array<Scalars["Bytes"]["input"]>
  >;
  lotId?: InputMaybe<Scalars["BigInt"]["input"]>;
  lotId_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  lotId_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  lotId_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  lotId_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  lotId_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  lotId_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  lotId_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<AuctionLot_Filter>>>;
  owner?: InputMaybe<Scalars["Bytes"]["input"]>;
  owner_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  owner_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  owner_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  owner_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  owner_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  owner_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  owner_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  owner_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  owner_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  purchased?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  purchased_gt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  purchased_gte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  purchased_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
  purchased_lt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  purchased_lte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  purchased_not?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  purchased_not_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
  purchases_?: InputMaybe<Purchase_Filter>;
  quoteToken?: InputMaybe<Scalars["String"]["input"]>;
  quoteToken_?: InputMaybe<Token_Filter>;
  quoteToken_contains?: InputMaybe<Scalars["String"]["input"]>;
  quoteToken_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  quoteToken_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  quoteToken_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  quoteToken_gt?: InputMaybe<Scalars["String"]["input"]>;
  quoteToken_gte?: InputMaybe<Scalars["String"]["input"]>;
  quoteToken_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  quoteToken_lt?: InputMaybe<Scalars["String"]["input"]>;
  quoteToken_lte?: InputMaybe<Scalars["String"]["input"]>;
  quoteToken_not?: InputMaybe<Scalars["String"]["input"]>;
  quoteToken_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  quoteToken_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  quoteToken_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  quoteToken_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  quoteToken_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  quoteToken_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  quoteToken_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  quoteToken_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  quoteToken_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  refundedBids_?: InputMaybe<RefundBid_Filter>;
  settle_?: InputMaybe<Settle_Filter>;
  sold?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  sold_gt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  sold_gte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  sold_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
  sold_lt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  sold_lte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  sold_not?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  sold_not_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
  start?: InputMaybe<Scalars["BigInt"]["input"]>;
  start_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  start_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  start_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  start_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  start_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  start_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  start_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  wrapDerivative?: InputMaybe<Scalars["Boolean"]["input"]>;
  wrapDerivative_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  wrapDerivative_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  wrapDerivative_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
};

export enum AuctionLot_OrderBy {
  auctionRef = "auctionRef",
  baseToken = "baseToken",
  baseToken__address = "baseToken__address",
  baseToken__decimals = "baseToken__decimals",
  baseToken__id = "baseToken__id",
  baseToken__name = "baseToken__name",
  baseToken__symbol = "baseToken__symbol",
  Bids = "bids",
  bidsDecrypted = "bidsDecrypted",
  Cancelled = "cancelled",
  cancelled__auctionRef = "cancelled__auctionRef",
  cancelled__blockNumber = "cancelled__blockNumber",
  cancelled__blockTimestamp = "cancelled__blockTimestamp",
  Cancelled__id = "cancelled__id",
  cancelled__transactionHash = "cancelled__transactionHash",
  Capacity = "capacity",
  capacityInQuote = "capacityInQuote",
  capacityInitial = "capacityInitial",
  Chain = "chain",
  Conclusion = "conclusion",
  Created = "created",
  createdBlockNumber = "createdBlockNumber",
  createdBlockTimestamp = "createdBlockTimestamp",
  createdTransactionHash = "createdTransactionHash",
  created__blockNumber = "created__blockNumber",
  created__blockTimestamp = "created__blockTimestamp",
  Created__id = "created__id",
  created__infoHash = "created__infoHash",
  created__transactionHash = "created__transactionHash",
  Curated = "curated",
  curated__blockNumber = "curated__blockNumber",
  curated__blockTimestamp = "curated__blockTimestamp",
  Curated__curator = "curated__curator",
  Curated__id = "curated__id",
  curated__transactionHash = "curated__transactionHash",
  Curator = "curator",
  curatorApproved = "curatorApproved",
  derivativeRef = "derivativeRef",
  Id = "id",
  lastUpdatedBlockNumber = "lastUpdatedBlockNumber",
  lastUpdatedBlockTimestamp = "lastUpdatedBlockTimestamp",
  lastUpdatedTransactionHash = "lastUpdatedTransactionHash",
  lotId = "lotId",
  Owner = "owner",
  Purchased = "purchased",
  Purchases = "purchases",
  quoteToken = "quoteToken",
  quoteToken__address = "quoteToken__address",
  quoteToken__decimals = "quoteToken__decimals",
  quoteToken__id = "quoteToken__id",
  quoteToken__name = "quoteToken__name",
  quoteToken__symbol = "quoteToken__symbol",
  refundedBids = "refundedBids",
  Settle = "settle",
  settle__blockNumber = "settle__blockNumber",
  settle__blockTimestamp = "settle__blockTimestamp",
  Settle__id = "settle__id",
  settle__transactionHash = "settle__transactionHash",
  Sold = "sold",
  Start = "start",
  wrapDerivative = "wrapDerivative",
}

export type Bid = {
  amount: Scalars["BigDecimal"]["output"];
  bidId: Scalars["BigInt"]["output"];
  bidder: Scalars["Bytes"]["output"];
  blockNumber: Scalars["BigInt"]["output"];
  blockTimestamp: Scalars["BigInt"]["output"];
  decrypted?: Maybe<BidDecrypted>;
  id: Scalars["String"]["output"];
  lot: AuctionLot;
  refunded?: Maybe<RefundBid>;
  transactionHash: Scalars["Bytes"]["output"];
};

export type BidDecrypted = {
  amountIn: Scalars["BigDecimal"]["output"];
  amountOut: Scalars["BigDecimal"]["output"];
  bid: Bid;
  blockNumber: Scalars["BigInt"]["output"];
  blockTimestamp: Scalars["BigInt"]["output"];
  id: Scalars["Bytes"]["output"];
  lot: AuctionLot;
  transactionHash: Scalars["Bytes"]["output"];
};

export type BidDecrypted_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amountIn?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  amountIn_gt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  amountIn_gte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  amountIn_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
  amountIn_lt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  amountIn_lte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  amountIn_not?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  amountIn_not_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
  amountOut?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  amountOut_gt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  amountOut_gte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  amountOut_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
  amountOut_lt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  amountOut_lte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  amountOut_not?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  amountOut_not_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
  and?: InputMaybe<Array<InputMaybe<BidDecrypted_Filter>>>;
  bid?: InputMaybe<Scalars["String"]["input"]>;
  bid_?: InputMaybe<Bid_Filter>;
  bid_contains?: InputMaybe<Scalars["String"]["input"]>;
  bid_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  bid_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  bid_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  bid_gt?: InputMaybe<Scalars["String"]["input"]>;
  bid_gte?: InputMaybe<Scalars["String"]["input"]>;
  bid_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  bid_lt?: InputMaybe<Scalars["String"]["input"]>;
  bid_lte?: InputMaybe<Scalars["String"]["input"]>;
  bid_not?: InputMaybe<Scalars["String"]["input"]>;
  bid_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  bid_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  bid_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  bid_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  bid_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  bid_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  bid_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  bid_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  bid_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  blockNumber?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  id?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  id_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  lot?: InputMaybe<Scalars["String"]["input"]>;
  lot_?: InputMaybe<AuctionLot_Filter>;
  lot_contains?: InputMaybe<Scalars["String"]["input"]>;
  lot_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lot_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  lot_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lot_gt?: InputMaybe<Scalars["String"]["input"]>;
  lot_gte?: InputMaybe<Scalars["String"]["input"]>;
  lot_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  lot_lt?: InputMaybe<Scalars["String"]["input"]>;
  lot_lte?: InputMaybe<Scalars["String"]["input"]>;
  lot_not?: InputMaybe<Scalars["String"]["input"]>;
  lot_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  lot_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lot_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  lot_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lot_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  lot_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  lot_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lot_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  lot_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  or?: InputMaybe<Array<InputMaybe<BidDecrypted_Filter>>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum BidDecrypted_OrderBy {
  amountIn = "amountIn",
  amountOut = "amountOut",
  Bid = "bid",
  Bid__amount = "bid__amount",
  bid__bidId = "bid__bidId",
  Bid__bidder = "bid__bidder",
  bid__blockNumber = "bid__blockNumber",
  bid__blockTimestamp = "bid__blockTimestamp",
  Bid__id = "bid__id",
  bid__transactionHash = "bid__transactionHash",
  blockNumber = "blockNumber",
  blockTimestamp = "blockTimestamp",
  Id = "id",
  Lot = "lot",
  lot__auctionRef = "lot__auctionRef",
  Lot__capacity = "lot__capacity",
  lot__capacityInQuote = "lot__capacityInQuote",
  lot__capacityInitial = "lot__capacityInitial",
  Lot__chain = "lot__chain",
  Lot__conclusion = "lot__conclusion",
  lot__createdBlockNumber = "lot__createdBlockNumber",
  lot__createdBlockTimestamp = "lot__createdBlockTimestamp",
  lot__createdTransactionHash = "lot__createdTransactionHash",
  Lot__curator = "lot__curator",
  lot__curatorApproved = "lot__curatorApproved",
  lot__derivativeRef = "lot__derivativeRef",
  Lot__id = "lot__id",
  lot__lastUpdatedBlockNumber = "lot__lastUpdatedBlockNumber",
  lot__lastUpdatedBlockTimestamp = "lot__lastUpdatedBlockTimestamp",
  lot__lastUpdatedTransactionHash = "lot__lastUpdatedTransactionHash",
  lot__lotId = "lot__lotId",
  Lot__owner = "lot__owner",
  Lot__purchased = "lot__purchased",
  Lot__sold = "lot__sold",
  Lot__start = "lot__start",
  lot__wrapDerivative = "lot__wrapDerivative",
  transactionHash = "transactionHash",
}

export type Bid_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  amount_gt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  amount_gte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  amount_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
  amount_lt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  amount_lte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  amount_not?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  amount_not_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
  and?: InputMaybe<Array<InputMaybe<Bid_Filter>>>;
  bidId?: InputMaybe<Scalars["BigInt"]["input"]>;
  bidId_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  bidId_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  bidId_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  bidId_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  bidId_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  bidId_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  bidId_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  bidder?: InputMaybe<Scalars["Bytes"]["input"]>;
  bidder_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  bidder_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  bidder_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  bidder_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  bidder_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  bidder_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  bidder_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  bidder_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  bidder_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  blockNumber?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  decrypted_?: InputMaybe<BidDecrypted_Filter>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  id_contains?: InputMaybe<Scalars["String"]["input"]>;
  id_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  id_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id_gt?: InputMaybe<Scalars["String"]["input"]>;
  id_gte?: InputMaybe<Scalars["String"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id_lt?: InputMaybe<Scalars["String"]["input"]>;
  id_lte?: InputMaybe<Scalars["String"]["input"]>;
  id_not?: InputMaybe<Scalars["String"]["input"]>;
  id_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  id_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  id_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  id_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  id_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lot?: InputMaybe<Scalars["String"]["input"]>;
  lot_?: InputMaybe<AuctionLot_Filter>;
  lot_contains?: InputMaybe<Scalars["String"]["input"]>;
  lot_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lot_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  lot_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lot_gt?: InputMaybe<Scalars["String"]["input"]>;
  lot_gte?: InputMaybe<Scalars["String"]["input"]>;
  lot_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  lot_lt?: InputMaybe<Scalars["String"]["input"]>;
  lot_lte?: InputMaybe<Scalars["String"]["input"]>;
  lot_not?: InputMaybe<Scalars["String"]["input"]>;
  lot_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  lot_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lot_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  lot_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lot_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  lot_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  lot_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lot_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  lot_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  or?: InputMaybe<Array<InputMaybe<Bid_Filter>>>;
  refunded_?: InputMaybe<RefundBid_Filter>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum Bid_OrderBy {
  Amount = "amount",
  bidId = "bidId",
  Bidder = "bidder",
  blockNumber = "blockNumber",
  blockTimestamp = "blockTimestamp",
  Decrypted = "decrypted",
  decrypted__amountIn = "decrypted__amountIn",
  decrypted__amountOut = "decrypted__amountOut",
  decrypted__blockNumber = "decrypted__blockNumber",
  decrypted__blockTimestamp = "decrypted__blockTimestamp",
  Decrypted__id = "decrypted__id",
  decrypted__transactionHash = "decrypted__transactionHash",
  Id = "id",
  Lot = "lot",
  lot__auctionRef = "lot__auctionRef",
  Lot__capacity = "lot__capacity",
  lot__capacityInQuote = "lot__capacityInQuote",
  lot__capacityInitial = "lot__capacityInitial",
  Lot__chain = "lot__chain",
  Lot__conclusion = "lot__conclusion",
  lot__createdBlockNumber = "lot__createdBlockNumber",
  lot__createdBlockTimestamp = "lot__createdBlockTimestamp",
  lot__createdTransactionHash = "lot__createdTransactionHash",
  Lot__curator = "lot__curator",
  lot__curatorApproved = "lot__curatorApproved",
  lot__derivativeRef = "lot__derivativeRef",
  Lot__id = "lot__id",
  lot__lastUpdatedBlockNumber = "lot__lastUpdatedBlockNumber",
  lot__lastUpdatedBlockTimestamp = "lot__lastUpdatedBlockTimestamp",
  lot__lastUpdatedTransactionHash = "lot__lastUpdatedTransactionHash",
  lot__lotId = "lot__lotId",
  Lot__owner = "lot__owner",
  Lot__purchased = "lot__purchased",
  Lot__sold = "lot__sold",
  Lot__start = "lot__start",
  lot__wrapDerivative = "lot__wrapDerivative",
  Refunded = "refunded",
  Refunded__bidder = "refunded__bidder",
  refunded__blockNumber = "refunded__blockNumber",
  refunded__blockTimestamp = "refunded__blockTimestamp",
  Refunded__id = "refunded__id",
  refunded__transactionHash = "refunded__transactionHash",
  transactionHash = "transactionHash",
}

export type BlockChangedFilter = {
  number_gte: Scalars["Int"]["input"];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars["Bytes"]["input"]>;
  number?: InputMaybe<Scalars["Int"]["input"]>;
  number_gte?: InputMaybe<Scalars["Int"]["input"]>;
};

export type Curated = {
  blockNumber: Scalars["BigInt"]["output"];
  blockTimestamp: Scalars["BigInt"]["output"];
  curator: Scalars["Bytes"]["output"];
  id: Scalars["Bytes"]["output"];
  lot: AuctionLot;
  transactionHash: Scalars["Bytes"]["output"];
};

export type Curated_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Curated_Filter>>>;
  blockNumber?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  curator?: InputMaybe<Scalars["Bytes"]["input"]>;
  curator_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  curator_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  curator_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  curator_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  curator_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  curator_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  curator_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  curator_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  curator_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  id?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  id_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  lot?: InputMaybe<Scalars["String"]["input"]>;
  lot_?: InputMaybe<AuctionLot_Filter>;
  lot_contains?: InputMaybe<Scalars["String"]["input"]>;
  lot_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lot_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  lot_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lot_gt?: InputMaybe<Scalars["String"]["input"]>;
  lot_gte?: InputMaybe<Scalars["String"]["input"]>;
  lot_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  lot_lt?: InputMaybe<Scalars["String"]["input"]>;
  lot_lte?: InputMaybe<Scalars["String"]["input"]>;
  lot_not?: InputMaybe<Scalars["String"]["input"]>;
  lot_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  lot_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lot_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  lot_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lot_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  lot_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  lot_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lot_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  lot_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  or?: InputMaybe<Array<InputMaybe<Curated_Filter>>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum Curated_OrderBy {
  blockNumber = "blockNumber",
  blockTimestamp = "blockTimestamp",
  Curator = "curator",
  Id = "id",
  Lot = "lot",
  lot__auctionRef = "lot__auctionRef",
  Lot__capacity = "lot__capacity",
  lot__capacityInQuote = "lot__capacityInQuote",
  lot__capacityInitial = "lot__capacityInitial",
  Lot__chain = "lot__chain",
  Lot__conclusion = "lot__conclusion",
  lot__createdBlockNumber = "lot__createdBlockNumber",
  lot__createdBlockTimestamp = "lot__createdBlockTimestamp",
  lot__createdTransactionHash = "lot__createdTransactionHash",
  Lot__curator = "lot__curator",
  lot__curatorApproved = "lot__curatorApproved",
  lot__derivativeRef = "lot__derivativeRef",
  Lot__id = "lot__id",
  lot__lastUpdatedBlockNumber = "lot__lastUpdatedBlockNumber",
  lot__lastUpdatedBlockTimestamp = "lot__lastUpdatedBlockTimestamp",
  lot__lastUpdatedTransactionHash = "lot__lastUpdatedTransactionHash",
  lot__lotId = "lot__lotId",
  Lot__owner = "lot__owner",
  Lot__purchased = "lot__purchased",
  Lot__sold = "lot__sold",
  Lot__start = "lot__start",
  lot__wrapDerivative = "lot__wrapDerivative",
  transactionHash = "transactionHash",
}

export type ModuleInstalled = {
  address: Scalars["Bytes"]["output"];
  blockNumber: Scalars["BigInt"]["output"];
  blockTimestamp: Scalars["BigInt"]["output"];
  id: Scalars["Bytes"]["output"];
  keycode: Scalars["Bytes"]["output"];
  transactionHash: Scalars["Bytes"]["output"];
  version: Scalars["Int"]["output"];
};

export type ModuleInstalled_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  address?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  address_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  and?: InputMaybe<Array<InputMaybe<ModuleInstalled_Filter>>>;
  blockNumber?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  id?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  id_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  keycode?: InputMaybe<Scalars["Bytes"]["input"]>;
  keycode_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  keycode_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  keycode_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  keycode_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  keycode_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  keycode_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  keycode_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  keycode_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  keycode_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<ModuleInstalled_Filter>>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  version?: InputMaybe<Scalars["Int"]["input"]>;
  version_gt?: InputMaybe<Scalars["Int"]["input"]>;
  version_gte?: InputMaybe<Scalars["Int"]["input"]>;
  version_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  version_lt?: InputMaybe<Scalars["Int"]["input"]>;
  version_lte?: InputMaybe<Scalars["Int"]["input"]>;
  version_not?: InputMaybe<Scalars["Int"]["input"]>;
  version_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
};

export enum ModuleInstalled_OrderBy {
  Address = "address",
  blockNumber = "blockNumber",
  blockTimestamp = "blockTimestamp",
  Id = "id",
  Keycode = "keycode",
  transactionHash = "transactionHash",
  Version = "version",
}

export type ModuleSunset = {
  blockNumber: Scalars["BigInt"]["output"];
  blockTimestamp: Scalars["BigInt"]["output"];
  id: Scalars["Bytes"]["output"];
  keycode: Scalars["Bytes"]["output"];
  transactionHash: Scalars["Bytes"]["output"];
};

export type ModuleSunset_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ModuleSunset_Filter>>>;
  blockNumber?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  id?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  id_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  keycode?: InputMaybe<Scalars["Bytes"]["input"]>;
  keycode_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  keycode_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  keycode_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  keycode_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  keycode_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  keycode_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  keycode_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  keycode_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  keycode_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<ModuleSunset_Filter>>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum ModuleSunset_OrderBy {
  blockNumber = "blockNumber",
  blockTimestamp = "blockTimestamp",
  Id = "id",
  Keycode = "keycode",
  transactionHash = "transactionHash",
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = "asc",
  Desc = "desc",
}

export type OwnershipTransferred = {
  blockNumber: Scalars["BigInt"]["output"];
  blockTimestamp: Scalars["BigInt"]["output"];
  caller: Scalars["Bytes"]["output"];
  id: Scalars["Bytes"]["output"];
  newOwner: Scalars["Bytes"]["output"];
  transactionHash: Scalars["Bytes"]["output"];
};

export type OwnershipTransferred_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<OwnershipTransferred_Filter>>>;
  blockNumber?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  caller?: InputMaybe<Scalars["Bytes"]["input"]>;
  caller_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  caller_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  caller_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  caller_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  caller_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  caller_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  caller_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  caller_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  caller_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  id?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  id_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  newOwner?: InputMaybe<Scalars["Bytes"]["input"]>;
  newOwner_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  newOwner_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  newOwner_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  newOwner_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  newOwner_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  newOwner_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  newOwner_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  newOwner_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  newOwner_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<OwnershipTransferred_Filter>>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum OwnershipTransferred_OrderBy {
  blockNumber = "blockNumber",
  blockTimestamp = "blockTimestamp",
  Caller = "caller",
  Id = "id",
  newOwner = "newOwner",
  transactionHash = "transactionHash",
}

export type Purchase = {
  amount: Scalars["BigDecimal"]["output"];
  blockNumber: Scalars["BigInt"]["output"];
  blockTimestamp: Scalars["BigInt"]["output"];
  buyer: Scalars["Bytes"]["output"];
  id: Scalars["Bytes"]["output"];
  lot: AuctionLot;
  payout: Scalars["BigDecimal"]["output"];
  referrer: Scalars["Bytes"]["output"];
  transactionHash: Scalars["Bytes"]["output"];
};

export type Purchase_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  amount_gt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  amount_gte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  amount_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
  amount_lt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  amount_lte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  amount_not?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  amount_not_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
  and?: InputMaybe<Array<InputMaybe<Purchase_Filter>>>;
  blockNumber?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  buyer?: InputMaybe<Scalars["Bytes"]["input"]>;
  buyer_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  buyer_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  buyer_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  buyer_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  buyer_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  buyer_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  buyer_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  buyer_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  buyer_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  id?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  id_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  lot?: InputMaybe<Scalars["String"]["input"]>;
  lot_?: InputMaybe<AuctionLot_Filter>;
  lot_contains?: InputMaybe<Scalars["String"]["input"]>;
  lot_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lot_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  lot_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lot_gt?: InputMaybe<Scalars["String"]["input"]>;
  lot_gte?: InputMaybe<Scalars["String"]["input"]>;
  lot_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  lot_lt?: InputMaybe<Scalars["String"]["input"]>;
  lot_lte?: InputMaybe<Scalars["String"]["input"]>;
  lot_not?: InputMaybe<Scalars["String"]["input"]>;
  lot_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  lot_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lot_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  lot_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lot_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  lot_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  lot_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lot_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  lot_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  or?: InputMaybe<Array<InputMaybe<Purchase_Filter>>>;
  payout?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  payout_gt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  payout_gte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  payout_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
  payout_lt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  payout_lte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  payout_not?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  payout_not_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
  referrer?: InputMaybe<Scalars["Bytes"]["input"]>;
  referrer_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  referrer_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  referrer_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  referrer_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  referrer_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  referrer_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  referrer_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  referrer_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  referrer_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum Purchase_OrderBy {
  Amount = "amount",
  blockNumber = "blockNumber",
  blockTimestamp = "blockTimestamp",
  Buyer = "buyer",
  Id = "id",
  Lot = "lot",
  lot__auctionRef = "lot__auctionRef",
  Lot__capacity = "lot__capacity",
  lot__capacityInQuote = "lot__capacityInQuote",
  lot__capacityInitial = "lot__capacityInitial",
  Lot__chain = "lot__chain",
  Lot__conclusion = "lot__conclusion",
  lot__createdBlockNumber = "lot__createdBlockNumber",
  lot__createdBlockTimestamp = "lot__createdBlockTimestamp",
  lot__createdTransactionHash = "lot__createdTransactionHash",
  Lot__curator = "lot__curator",
  lot__curatorApproved = "lot__curatorApproved",
  lot__derivativeRef = "lot__derivativeRef",
  Lot__id = "lot__id",
  lot__lastUpdatedBlockNumber = "lot__lastUpdatedBlockNumber",
  lot__lastUpdatedBlockTimestamp = "lot__lastUpdatedBlockTimestamp",
  lot__lastUpdatedTransactionHash = "lot__lastUpdatedTransactionHash",
  lot__lotId = "lot__lotId",
  Lot__owner = "lot__owner",
  Lot__purchased = "lot__purchased",
  Lot__sold = "lot__sold",
  Lot__start = "lot__start",
  lot__wrapDerivative = "lot__wrapDerivative",
  Payout = "payout",
  Referrer = "referrer",
  transactionHash = "transactionHash",
}

export type Query = {
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  auctionCancelled?: Maybe<AuctionCancelled>;
  auctionCancelleds: Array<AuctionCancelled>;
  auctionCreated?: Maybe<AuctionCreated>;
  auctionCreateds: Array<AuctionCreated>;
  auctionLot?: Maybe<AuctionLot>;
  auctionLots: Array<AuctionLot>;
  bid?: Maybe<Bid>;
  bidDecrypted?: Maybe<BidDecrypted>;
  bidDecrypteds: Array<BidDecrypted>;
  bids: Array<Bid>;
  curated?: Maybe<Curated>;
  curateds: Array<Curated>;
  moduleInstalled?: Maybe<ModuleInstalled>;
  moduleInstalleds: Array<ModuleInstalled>;
  moduleSunset?: Maybe<ModuleSunset>;
  moduleSunsets: Array<ModuleSunset>;
  ownershipTransferred?: Maybe<OwnershipTransferred>;
  ownershipTransferreds: Array<OwnershipTransferred>;
  purchase?: Maybe<Purchase>;
  purchases: Array<Purchase>;
  refundBid?: Maybe<RefundBid>;
  refundBids: Array<RefundBid>;
  settle?: Maybe<Settle>;
  settles: Array<Settle>;
  token?: Maybe<Token>;
  tokens: Array<Token>;
};

export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};

export type QueryAuctionCancelledArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryAuctionCancelledsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<AuctionCancelled_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AuctionCancelled_Filter>;
};

export type QueryAuctionCreatedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryAuctionCreatedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<AuctionCreated_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AuctionCreated_Filter>;
};

export type QueryAuctionLotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryAuctionLotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<AuctionLot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AuctionLot_Filter>;
};

export type QueryBidArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryBidDecryptedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryBidDecryptedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<BidDecrypted_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<BidDecrypted_Filter>;
};

export type QueryBidsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Bid_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Bid_Filter>;
};

export type QueryCuratedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryCuratedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Curated_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Curated_Filter>;
};

export type QueryModuleInstalledArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryModuleInstalledsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<ModuleInstalled_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ModuleInstalled_Filter>;
};

export type QueryModuleSunsetArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryModuleSunsetsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<ModuleSunset_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ModuleSunset_Filter>;
};

export type QueryOwnershipTransferredArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryOwnershipTransferredsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<OwnershipTransferred_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OwnershipTransferred_Filter>;
};

export type QueryPurchaseArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryPurchasesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Purchase_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Purchase_Filter>;
};

export type QueryRefundBidArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryRefundBidsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<RefundBid_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RefundBid_Filter>;
};

export type QuerySettleArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QuerySettlesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Settle_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Settle_Filter>;
};

export type QueryTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Token_Filter>;
};

export type RefundBid = {
  bid: Bid;
  bidder: Scalars["Bytes"]["output"];
  blockNumber: Scalars["BigInt"]["output"];
  blockTimestamp: Scalars["BigInt"]["output"];
  id: Scalars["Bytes"]["output"];
  lot: AuctionLot;
  transactionHash: Scalars["Bytes"]["output"];
};

export type RefundBid_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<RefundBid_Filter>>>;
  bid?: InputMaybe<Scalars["String"]["input"]>;
  bid_?: InputMaybe<Bid_Filter>;
  bid_contains?: InputMaybe<Scalars["String"]["input"]>;
  bid_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  bid_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  bid_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  bid_gt?: InputMaybe<Scalars["String"]["input"]>;
  bid_gte?: InputMaybe<Scalars["String"]["input"]>;
  bid_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  bid_lt?: InputMaybe<Scalars["String"]["input"]>;
  bid_lte?: InputMaybe<Scalars["String"]["input"]>;
  bid_not?: InputMaybe<Scalars["String"]["input"]>;
  bid_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  bid_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  bid_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  bid_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  bid_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  bid_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  bid_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  bid_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  bid_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  bidder?: InputMaybe<Scalars["Bytes"]["input"]>;
  bidder_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  bidder_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  bidder_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  bidder_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  bidder_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  bidder_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  bidder_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  bidder_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  bidder_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  blockNumber?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  id?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  id_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  lot?: InputMaybe<Scalars["String"]["input"]>;
  lot_?: InputMaybe<AuctionLot_Filter>;
  lot_contains?: InputMaybe<Scalars["String"]["input"]>;
  lot_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lot_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  lot_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lot_gt?: InputMaybe<Scalars["String"]["input"]>;
  lot_gte?: InputMaybe<Scalars["String"]["input"]>;
  lot_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  lot_lt?: InputMaybe<Scalars["String"]["input"]>;
  lot_lte?: InputMaybe<Scalars["String"]["input"]>;
  lot_not?: InputMaybe<Scalars["String"]["input"]>;
  lot_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  lot_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lot_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  lot_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lot_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  lot_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  lot_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lot_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  lot_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  or?: InputMaybe<Array<InputMaybe<RefundBid_Filter>>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum RefundBid_OrderBy {
  Bid = "bid",
  Bid__amount = "bid__amount",
  bid__bidId = "bid__bidId",
  Bid__bidder = "bid__bidder",
  bid__blockNumber = "bid__blockNumber",
  bid__blockTimestamp = "bid__blockTimestamp",
  Bid__id = "bid__id",
  bid__transactionHash = "bid__transactionHash",
  Bidder = "bidder",
  blockNumber = "blockNumber",
  blockTimestamp = "blockTimestamp",
  Id = "id",
  Lot = "lot",
  lot__auctionRef = "lot__auctionRef",
  Lot__capacity = "lot__capacity",
  lot__capacityInQuote = "lot__capacityInQuote",
  lot__capacityInitial = "lot__capacityInitial",
  Lot__chain = "lot__chain",
  Lot__conclusion = "lot__conclusion",
  lot__createdBlockNumber = "lot__createdBlockNumber",
  lot__createdBlockTimestamp = "lot__createdBlockTimestamp",
  lot__createdTransactionHash = "lot__createdTransactionHash",
  Lot__curator = "lot__curator",
  lot__curatorApproved = "lot__curatorApproved",
  lot__derivativeRef = "lot__derivativeRef",
  Lot__id = "lot__id",
  lot__lastUpdatedBlockNumber = "lot__lastUpdatedBlockNumber",
  lot__lastUpdatedBlockTimestamp = "lot__lastUpdatedBlockTimestamp",
  lot__lastUpdatedTransactionHash = "lot__lastUpdatedTransactionHash",
  lot__lotId = "lot__lotId",
  Lot__owner = "lot__owner",
  Lot__purchased = "lot__purchased",
  Lot__sold = "lot__sold",
  Lot__start = "lot__start",
  lot__wrapDerivative = "lot__wrapDerivative",
  transactionHash = "transactionHash",
}

export type Settle = {
  blockNumber: Scalars["BigInt"]["output"];
  blockTimestamp: Scalars["BigInt"]["output"];
  id: Scalars["Bytes"]["output"];
  lot: AuctionLot;
  transactionHash: Scalars["Bytes"]["output"];
};

export type Settle_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Settle_Filter>>>;
  blockNumber?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  id?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  id_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  lot?: InputMaybe<Scalars["String"]["input"]>;
  lot_?: InputMaybe<AuctionLot_Filter>;
  lot_contains?: InputMaybe<Scalars["String"]["input"]>;
  lot_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lot_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  lot_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lot_gt?: InputMaybe<Scalars["String"]["input"]>;
  lot_gte?: InputMaybe<Scalars["String"]["input"]>;
  lot_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  lot_lt?: InputMaybe<Scalars["String"]["input"]>;
  lot_lte?: InputMaybe<Scalars["String"]["input"]>;
  lot_not?: InputMaybe<Scalars["String"]["input"]>;
  lot_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  lot_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lot_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  lot_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lot_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  lot_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  lot_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  lot_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  lot_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  or?: InputMaybe<Array<InputMaybe<Settle_Filter>>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum Settle_OrderBy {
  blockNumber = "blockNumber",
  blockTimestamp = "blockTimestamp",
  Id = "id",
  Lot = "lot",
  lot__auctionRef = "lot__auctionRef",
  Lot__capacity = "lot__capacity",
  lot__capacityInQuote = "lot__capacityInQuote",
  lot__capacityInitial = "lot__capacityInitial",
  Lot__chain = "lot__chain",
  Lot__conclusion = "lot__conclusion",
  lot__createdBlockNumber = "lot__createdBlockNumber",
  lot__createdBlockTimestamp = "lot__createdBlockTimestamp",
  lot__createdTransactionHash = "lot__createdTransactionHash",
  Lot__curator = "lot__curator",
  lot__curatorApproved = "lot__curatorApproved",
  lot__derivativeRef = "lot__derivativeRef",
  Lot__id = "lot__id",
  lot__lastUpdatedBlockNumber = "lot__lastUpdatedBlockNumber",
  lot__lastUpdatedBlockTimestamp = "lot__lastUpdatedBlockTimestamp",
  lot__lastUpdatedTransactionHash = "lot__lastUpdatedTransactionHash",
  lot__lotId = "lot__lotId",
  Lot__owner = "lot__owner",
  Lot__purchased = "lot__purchased",
  Lot__sold = "lot__sold",
  Lot__start = "lot__start",
  lot__wrapDerivative = "lot__wrapDerivative",
  transactionHash = "transactionHash",
}

export type Subscription = {
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  auctionCancelled?: Maybe<AuctionCancelled>;
  auctionCancelleds: Array<AuctionCancelled>;
  auctionCreated?: Maybe<AuctionCreated>;
  auctionCreateds: Array<AuctionCreated>;
  auctionLot?: Maybe<AuctionLot>;
  auctionLots: Array<AuctionLot>;
  bid?: Maybe<Bid>;
  bidDecrypted?: Maybe<BidDecrypted>;
  bidDecrypteds: Array<BidDecrypted>;
  bids: Array<Bid>;
  curated?: Maybe<Curated>;
  curateds: Array<Curated>;
  moduleInstalled?: Maybe<ModuleInstalled>;
  moduleInstalleds: Array<ModuleInstalled>;
  moduleSunset?: Maybe<ModuleSunset>;
  moduleSunsets: Array<ModuleSunset>;
  ownershipTransferred?: Maybe<OwnershipTransferred>;
  ownershipTransferreds: Array<OwnershipTransferred>;
  purchase?: Maybe<Purchase>;
  purchases: Array<Purchase>;
  refundBid?: Maybe<RefundBid>;
  refundBids: Array<RefundBid>;
  settle?: Maybe<Settle>;
  settles: Array<Settle>;
  token?: Maybe<Token>;
  tokens: Array<Token>;
};

export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};

export type SubscriptionAuctionCancelledArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionAuctionCancelledsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<AuctionCancelled_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AuctionCancelled_Filter>;
};

export type SubscriptionAuctionCreatedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionAuctionCreatedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<AuctionCreated_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AuctionCreated_Filter>;
};

export type SubscriptionAuctionLotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionAuctionLotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<AuctionLot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AuctionLot_Filter>;
};

export type SubscriptionBidArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionBidDecryptedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionBidDecryptedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<BidDecrypted_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<BidDecrypted_Filter>;
};

export type SubscriptionBidsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Bid_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Bid_Filter>;
};

export type SubscriptionCuratedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionCuratedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Curated_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Curated_Filter>;
};

export type SubscriptionModuleInstalledArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionModuleInstalledsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<ModuleInstalled_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ModuleInstalled_Filter>;
};

export type SubscriptionModuleSunsetArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionModuleSunsetsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<ModuleSunset_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ModuleSunset_Filter>;
};

export type SubscriptionOwnershipTransferredArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionOwnershipTransferredsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<OwnershipTransferred_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OwnershipTransferred_Filter>;
};

export type SubscriptionPurchaseArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionPurchasesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Purchase_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Purchase_Filter>;
};

export type SubscriptionRefundBidArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionRefundBidsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<RefundBid_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RefundBid_Filter>;
};

export type SubscriptionSettleArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionSettlesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Settle_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Settle_Filter>;
};

export type SubscriptionTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Token_Filter>;
};

export type Token = {
  address: Scalars["Bytes"]["output"];
  decimals: Scalars["Int"]["output"];
  id: Scalars["Bytes"]["output"];
  name: Scalars["String"]["output"];
  symbol: Scalars["String"]["output"];
};

export type Token_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  address?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  address_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  and?: InputMaybe<Array<InputMaybe<Token_Filter>>>;
  decimals?: InputMaybe<Scalars["Int"]["input"]>;
  decimals_gt?: InputMaybe<Scalars["Int"]["input"]>;
  decimals_gte?: InputMaybe<Scalars["Int"]["input"]>;
  decimals_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  decimals_lt?: InputMaybe<Scalars["Int"]["input"]>;
  decimals_lte?: InputMaybe<Scalars["Int"]["input"]>;
  decimals_not?: InputMaybe<Scalars["Int"]["input"]>;
  decimals_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  id?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  id_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  name_contains?: InputMaybe<Scalars["String"]["input"]>;
  name_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  name_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  name_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  name_gt?: InputMaybe<Scalars["String"]["input"]>;
  name_gte?: InputMaybe<Scalars["String"]["input"]>;
  name_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  name_lt?: InputMaybe<Scalars["String"]["input"]>;
  name_lte?: InputMaybe<Scalars["String"]["input"]>;
  name_not?: InputMaybe<Scalars["String"]["input"]>;
  name_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  name_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  name_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  name_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  name_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  name_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  name_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  name_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  name_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  or?: InputMaybe<Array<InputMaybe<Token_Filter>>>;
  symbol?: InputMaybe<Scalars["String"]["input"]>;
  symbol_contains?: InputMaybe<Scalars["String"]["input"]>;
  symbol_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  symbol_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  symbol_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  symbol_gt?: InputMaybe<Scalars["String"]["input"]>;
  symbol_gte?: InputMaybe<Scalars["String"]["input"]>;
  symbol_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  symbol_lt?: InputMaybe<Scalars["String"]["input"]>;
  symbol_lte?: InputMaybe<Scalars["String"]["input"]>;
  symbol_not?: InputMaybe<Scalars["String"]["input"]>;
  symbol_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  symbol_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  symbol_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  symbol_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  symbol_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  symbol_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  symbol_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  symbol_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  symbol_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
};

export enum Token_OrderBy {
  Address = "address",
  Decimals = "decimals",
  Id = "id",
  Name = "name",
  Symbol = "symbol",
}

export type _Block_ = {
  /** The hash of the block */
  hash?: Maybe<Scalars["Bytes"]["output"]>;
  /** The block number */
  number: Scalars["Int"]["output"];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars["Int"]["output"]>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars["String"]["output"];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars["Boolean"]["output"];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = "allow",
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = "deny",
}

export type AuctionLotFragmentFragment = {
  auctionRef: string;
  capacity: string;
  capacityInitial: string;
  capacityInQuote: boolean;
  chain: string;
  conclusion: string;
  createdBlockNumber: string;
  createdBlockTimestamp: string;
  createdTransactionHash: string;
  curator: string;
  curatorApproved: boolean;
  derivativeRef: string;
  id: string;
  lastUpdatedBlockNumber: string;
  lastUpdatedBlockTimestamp: string;
  lastUpdatedTransactionHash: string;
  lotId: string;
  owner: string;
  purchased: string;
  sold: string;
  start: string;
  wrapDerivative: boolean;
  baseToken: {
    address: string;
    decimals: string;
    symbol: string;
    name: string;
  };
  quoteToken: {
    address: string;
    decimals: string;
    name: string;
    symbol: string;
  };
};

export type GetAuctionLotsQueryVariables = Exact<{ [key: string]: never }>;

export type GetAuctionLotsQuery = {
  auctionLots: Array<{
    auctionRef: string;
    capacity: string;
    capacityInitial: string;
    capacityInQuote: boolean;
    chain: string;
    conclusion: string;
    createdBlockNumber: string;
    createdBlockTimestamp: string;
    createdTransactionHash: string;
    curator: string;
    curatorApproved: boolean;
    derivativeRef: string;
    id: string;
    lastUpdatedBlockNumber: string;
    lastUpdatedBlockTimestamp: string;
    lastUpdatedTransactionHash: string;
    lotId: string;
    owner: string;
    purchased: string;
    sold: string;
    start: string;
    wrapDerivative: boolean;
    baseToken: {
      address: string;
      decimals: string;
      symbol: string;
      name: string;
    };
    quoteToken: {
      address: string;
      decimals: string;
      name: string;
      symbol: string;
    };
  }>;
};

export type GetAuctionLotQueryVariables = Exact<{
  lotId: Scalars["BigInt"]["input"];
}>;

export type GetAuctionLotQuery = {
  auctionLots: Array<{
    auctionRef: string;
    capacity: string;
    capacityInitial: string;
    capacityInQuote: boolean;
    chain: string;
    conclusion: string;
    createdBlockNumber: string;
    createdBlockTimestamp: string;
    createdTransactionHash: string;
    curator: string;
    curatorApproved: boolean;
    derivativeRef: string;
    id: string;
    lastUpdatedBlockNumber: string;
    lastUpdatedBlockTimestamp: string;
    lastUpdatedTransactionHash: string;
    lotId: string;
    owner: string;
    purchased: string;
    sold: string;
    start: string;
    wrapDerivative: boolean;
    created: {
      blockNumber: string;
      blockTimestamp: string;
      id: string;
      transactionHash: string;
      infoHash: string;
    };
    cancelled?: {
      blockNumber: string;
      blockTimestamp: string;
      id: string;
      transactionHash: string;
    } | null;
    bids: Array<{
      amount: string;
      bidder: string;
      bidId: string;
      blockNumber: string;
      blockTimestamp: string;
      id: string;
      transactionHash: string;
    }>;
    refundedBids: Array<{
      blockNumber: string;
      blockTimestamp: string;
      id: string;
      transactionHash: string;
      bid: { bidId: string; bidder: string; amount: string };
    }>;
    bidsDecrypted: Array<{
      amountIn: string;
      amountOut: string;
      blockNumber: string;
      blockTimestamp: string;
      id: string;
      transactionHash: string;
      bid: { bidId: string; bidder: string; amount: string };
    }>;
    purchases: Array<{
      amount: string;
      blockNumber: string;
      blockTimestamp: string;
      buyer: string;
      id: string;
      payout: string;
      referrer: string;
      transactionHash: string;
    }>;
    settle?: {
      blockNumber: string;
      blockTimestamp: string;
      id: string;
      transactionHash: string;
    } | null;
    curated?: {
      blockNumber: string;
      blockTimestamp: string;
      curator: string;
      id: string;
      transactionHash: string;
    } | null;
    baseToken: {
      address: string;
      decimals: string;
      symbol: string;
      name: string;
    };
    quoteToken: {
      address: string;
      decimals: string;
      name: string;
      symbol: string;
    };
  }>;
};

export const AuctionLotFragmentFragmentDoc = `
    fragment AuctionLotFragment on AuctionLot {
  auctionRef
  capacity
  capacityInitial
  capacityInQuote
  chain
  conclusion
  createdBlockNumber
  createdBlockTimestamp
  createdTransactionHash
  curator
  curatorApproved
  derivativeRef
  id
  lastUpdatedBlockNumber
  lastUpdatedBlockTimestamp
  lastUpdatedTransactionHash
  lotId
  owner
  purchased
  sold
  start
  wrapDerivative
  baseToken {
    address
    decimals
    symbol
    name
  }
  quoteToken {
    address
    decimals
    name
    symbol
  }
}
    `;
export const GetAuctionLotsDocument = `
    query getAuctionLots {
  auctionLots(orderBy: createdBlockNumber, orderDirection: asc) {
    ...AuctionLotFragment
  }
}
    ${AuctionLotFragmentFragmentDoc}`;

export const useGetAuctionLotsQuery = <
  TData = GetAuctionLotsQuery,
  TError = unknown,
>(
  variables?: GetAuctionLotsQueryVariables,
  options?: Omit<
    UseQueryOptions<GetAuctionLotsQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<GetAuctionLotsQuery, TError, TData>["queryKey"];
  },
) => {
  return useQuery<GetAuctionLotsQuery, TError, TData>({
    queryKey:
      variables === undefined
        ? ["getAuctionLots"]
        : ["getAuctionLots", variables],
    queryFn: fetcher<GetAuctionLotsQuery, GetAuctionLotsQueryVariables>(
      GetAuctionLotsDocument,
      variables,
    ),
    ...options,
  });
};

export const GetAuctionLotDocument = `
    query getAuctionLot($lotId: BigInt!) {
  auctionLots(
    orderBy: createdBlockNumber
    orderDirection: asc
    where: {lotId: $lotId}
    first: 1
  ) {
    ...AuctionLotFragment
    created {
      blockNumber
      blockTimestamp
      id
      transactionHash
      infoHash
    }
    cancelled {
      blockNumber
      blockTimestamp
      id
      transactionHash
    }
    bids {
      amount
      bidder
      bidId
      blockNumber
      blockTimestamp
      id
      transactionHash
    }
    refundedBids {
      blockNumber
      blockTimestamp
      id
      transactionHash
      bid {
        bidId
        bidder
        amount
      }
    }
    bidsDecrypted {
      amountIn
      amountOut
      blockNumber
      blockTimestamp
      id
      transactionHash
      bid {
        bidId
        bidder
        amount
      }
    }
    purchases {
      amount
      blockNumber
      blockTimestamp
      buyer
      id
      payout
      referrer
      transactionHash
    }
    settle {
      blockNumber
      blockTimestamp
      id
      transactionHash
    }
    curated {
      blockNumber
      blockTimestamp
      curator
      id
      transactionHash
    }
  }
}
    ${AuctionLotFragmentFragmentDoc}`;

export const useGetAuctionLotQuery = <
  TData = GetAuctionLotQuery,
  TError = unknown,
>(
  variables: GetAuctionLotQueryVariables,
  options?: Omit<
    UseQueryOptions<GetAuctionLotQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<GetAuctionLotQuery, TError, TData>["queryKey"];
  },
) => {
  return useQuery<GetAuctionLotQuery, TError, TData>({
    queryKey: ["getAuctionLot", variables],
    queryFn: fetcher<GetAuctionLotQuery, GetAuctionLotQueryVariables>(
      GetAuctionLotDocument,
      variables,
    ),
    ...options,
  });
};
