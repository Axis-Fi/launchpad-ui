import { AuctionType } from "@repo/types";
import { CreateAuctionForm } from "pages/create-auction-page";
import { getPercentage } from "utils/number";
import { encodeAbiParameters, parseUnits } from "viem";

const parameterMap = {
  [AuctionType.SEALED_BID]: [
    {
      name: "AuctionDataParams",
      internalType: "struct AuctionDataParams",
      type: "tuple",
      components: [
        { name: "minPrice", type: "uint96" },
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
  ] as const,
  [AuctionType.FIXED_PRICE_BATCH]: [
    {
      name: "FixedPriceBatchParams",
      internalType: "struct FixedPriceBatchParams",
      type: "tuple",
      components: [
        { name: "price", type: "uint96" },
        { name: "minFillPercent", type: "uint24" },
      ],
    },
  ] as const,
};

const handlers = {
  [AuctionType.SEALED_BID]: handleEMP,
  [AuctionType.FIXED_PRICE_BATCH]: handleFPB,
};

export function getAuctionCreateParams(
  type: AuctionType,
  values: CreateAuctionForm,
  key?: { x: bigint; y: bigint },
) {
  const handler = handlers[type];
  const params = parameterMap[type];
  const parsedValues = handler(values, key);
  //@ts-expect-error //TODO: type this correctly
  return encodeAbiParameters(params, parsedValues);
}

function handleEMP(
  values: CreateAuctionForm,
  publicKey?: { x: bigint; y: bigint },
) {
  if (!values.minBidSize || !values.minFillPercent || !values.minPrice) {
    throw new Error("handleEMP called without the correct values");
  }

  return [
    {
      minFillPercent: getPercentage(Number(values.minFillPercent[0])),
      minBidSize: parseUnits("0.01", values.quoteToken.decimals), // magic number intentional until a better way is agreed
      minPrice: parseUnits(values.minPrice, values.quoteToken.decimals),
      publicKey,
    } as const,
  ] as const;
}

function handleFPB(values: CreateAuctionForm) {
  if (!values.price || !values.minFillPercent) {
    throw new Error("handleFPB called without the correct values");
  }

  return [
    {
      price: parseUnits(values.price, values.quoteToken.decimals),
      minFillPercent: getPercentage(Number(values.minFillPercent[0])),
    },
  ];
}
