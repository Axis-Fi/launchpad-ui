import { type Hex, fromHex, toHex, encodeAbiParameters } from "viem";
import type { EncryptLotIdPost200Response, CloakClient } from "@repo/cloak";
import { abi, type EncryptBidParams } from ".";
import { SdkError } from "../../types";

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
    auctionHouseAddress,
  } = params;

  let result;

  try {
    result = await cloakClient.keysApi.encryptLotIdPost({
      xChainId: chainId,
      xAuctionHouse: auctionHouseAddress,
      lotId: lotId,
      encryptRequest: {
        amount: toHex(amountIn),
        amountOut: toHex(amountOut),
        bidder: bidderAddress,
      },
    });
  } catch {
    throw new SdkError("Failed to encrypt bid via cloak service");
  }

  if (!result || !result.ciphertext || !result.x || !result.y) {
    throw new SdkError("Failed to encrypt bid via cloak service");
  }

  return result;
};

const encodeEncryptedBid = (encryptedBid: EncryptLotIdPost200Response): Hex => {
  return encodeAbiParameters(abi.ENCRYPTED_BID_TYPE_ABI, [
    fromHex(encryptedBid.ciphertext as Hex, "bigint"),
    {
      x: fromHex(encryptedBid.x as Hex, "bigint"),
      y: fromHex(encryptedBid.y as Hex, "bigint"),
    },
  ]);
};

export { encryptBid, encodeEncryptedBid };
