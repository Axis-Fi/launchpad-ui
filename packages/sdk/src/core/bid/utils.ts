import {
  type Hex,
  fromHex,
  toHex,
  parseUnits,
  encodeAbiParameters,
} from "viem";
import type { EncryptLotIdPost200Response, CloakClient } from "@repo/cloak";
import { AUCTION_DATA_TYPE_ABI, type EncryptBidParams } from ".";

const encryptBid = async (
  params: EncryptBidParams,
  cloakClient: CloakClient,
): Promise<EncryptLotIdPost200Response> => {
  const {
    lotId,
    amountIn,
    amountOut,
    chainId,
    bidderAddress,
    quoteTokenDecimals,
    baseTokenDecimals,
    auctionHouseAddress,
  } = params;

  const quoteTokenAmountIn = parseUnits(
    amountIn.toString(),
    quoteTokenDecimals,
  );

  const baseTokenAmountOut = parseUnits(
    amountOut.toString(),
    baseTokenDecimals,
  );

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

export { encryptBid, encodeEncryptedBid };
