import {
  type Hex,
  fromHex,
  toHex,
  parseUnits,
  encodeAbiParameters,
  Address,
} from "viem";

import { deployments } from "@repo/deployments";
import type { EncryptLotIdPost200Response, CloakClient } from "@repo/cloak";
import type { BidParams } from ".";
import { AxisContractAddresses, Token } from "@repo/types";

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

const getAuction = () => {}; // TODO

const getContractAddresses = (chainId: number): AxisContractAddresses =>
  deployments[chainId!]?.addresses;

type EncryptBidParams = BidParams & {
  quoteToken: Token;
  baseToken: Token;
  auctionHouseAddress: Address;
};

const encryptBid = async (
  params: EncryptBidParams,
  cloakClient: CloakClient,
): EncryptLotIdPost200Response => {
  const {
    lotId,
    amountIn,
    amountOut,
    chainId,
    bidderAddress,
    quoteToken,
    baseToken,
    auctionHouseAddress,
  } = params;
  const quoteTokenAmountIn = parseUnits(
    amountIn.toString(),
    quoteToken.decimals,
  );
  const baseTokenAmountOut = parseUnits(
    amountOut.toString(),
    baseToken.decimals,
  );

  // TODO: review: error handling and better api than passing cloakClient
  return cloakClient.keysApi.encryptLotIdPost({
    xChainId: chainId,
    xAuctionHouse: auctionHouseAddress,
    lotId: lotId,
    encryptRequest: {
      amount: toHex(quoteTokenAmountIn),
      amountOut: toHex(baseTokenAmountOut),
      bidder: bidderAddress,
    },
  });
};

const encodeEncryptedBid = (encryptedBid: EncryptLotIdPost200Response): Hex => {
  return encodeAbiParameters(AUCTION_DATA_TYPE_ABI, [
    fromHex(encryptedBid.ciphertext as Hex, "bigint"),
    {
      x: fromHex(encryptedBid.x as Hex, "bigint"),
      y: fromHex(encryptedBid.y as Hex, "bigint"),
    },
  ]);
};

export { getAuction, getContractAddresses, encryptBid, encodeEncryptedBid };
