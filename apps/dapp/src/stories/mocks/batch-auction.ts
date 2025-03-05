//@ts-nocheck
import { AuctionType, type BatchAuction } from "@axis-finance/types";

const getBatchAuctionMock = (
  overrides: Partial<BatchAuction> | undefined = undefined,
): BatchAuction =>
  ({
    chainId: 168587773,
    baseToken: {
      symbol: "ZYN",
      decimals: 18,
      name: "Zyn Token",
      address: "0x08b87749b379f5bca1d74a7b3d4e9f3ded41c706",
      chainId: 168587773,
    },
    quoteToken: {
      symbol: "USDC",
      decimals: 18,
      name: "USDC Token",
      address: "0xe292cf4e316191cbfebd74909356df3cd9455e96",
      chainId: 168587773,
    },
    callbacks: "0x0000000000000000000000000000000000000000",
    status: "settled",
    info: {
      name: "Zyn Protocol",
      description:
        "The real ZYN coin. Join us ZYNNERs and be a part of the best attempt at bringing nicotine on-chain",
      links: [
        {
          linkId: "payoutTokenLogo",
          url: "https://www.logolynx.com/images/logolynx/68/68feadd5125aba3db46f1e4d77d54cfa.jpeg",
        },
        {
          linkId: "projectLogo",
          url: "https://www.fandfwholesale.com/media/catalog/product/cache/1ecf0a9687bd7fb333e2e3dda40a5d04/z/y/zyn_nicotine_pouches_cool_mint_6mg.jpg",
        },
        {
          linkId: "website",
          url: "https://numba.one",
        },
      ],
    },
    id: "blast-sepolia-0x1234567890123456789012345678901234567890-1",
    chain: "blast-sepolia",
    auctionHouse: "0x1234567890123456789012345678901234567890",
    lotId: "1",
    createdBlockNumber: "12345678",
    createdBlockTimestamp: "1622000000",
    createdDate: "2023-05-15T10:00:00.000Z",
    createdTransactionHash:
      "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    capacityInitial: "1000",
    start: "1715186981",
    conclusion: "1715274000",
    auctionType: AuctionType.SEALED_BID,
    seller: "0x0987654321098765432109876543210987654321",
    derivativeType: null,
    wrapDerivative: false,
    curator: "0x1111111111111111111111111111111111111111",
    curatorApproved: true,
    curatorFee: "50",
    protocolFee: "25",
    referrerFee: "10",
    capacity: "800",
    sold: "200",
    purchased: "200",
    lastUpdatedBlockNumber: "12345679",
    lastUpdatedBlockTimestamp: "1622000060",
    lastUpdatedDate: "2023-05-15T10:01:00.000Z",
    lastUpdatedTransactionHash:
      "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    maxBidId: "1",
    linearVesting: {
      id: "1",
      startDate: "2023-05-22T10:00:00.000Z",
      expiryDate: "2023-06-22T10:00:00.000Z",
      startTimestamp: "1653220800",
      expiryTimestamp: "1655899200",
    },
    created: {
      infoHash: "QmabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRST",
    },
    curated: {
      curator: "0x1111111111111111111111111111111111111111",
    },
    bids: [
      {
        bidId: "1",
        bidder: "0x4444444444444444444444444444444444444444",
        blockTimestamp: "1622000030",
        date: "2023-05-15T10:00:30.000Z",
        amountIn: "100",
        rawAmountIn: "100000000000000000000",
        rawAmountOut: "200000000",
        rawMarginalPrice: "500000000000000000",
        rawSubmittedPrice: "600000000000000000",
        submittedPrice: "600",
        settledAmountIn: "100",
        settledAmountInRefunded: null,
        settledAmountOut: "200",
        status: "settled",
        outcome: "filled",
        referrer: "0x5555555555555555555555555555555555555555",
        claimed: {
          id: "1",
        },
      },
    ],
    bidsDecrypted: [
      {
        id: "1",
      },
    ],
    bidsClaimed: [
      {
        id: "1",
      },
    ],
    bidsRefunded: [],
    encryptedMarginalPrice: {
      id: "1",
      status: "settled",
      settlementSuccessful: true,
      minPrice: "500",
      minFilled: "200",
      minBidSize: "100",
      marginalPrice: "500",
      hasPartialFill: false,
    },
    settled: {
      id: "1",
    },
    ...overrides,
  }) satisfies BatchAuction;

const getFixedPriceBatchAuctionMock = (
  overrides: Partial<BatchAuction> | undefined = undefined,
): BatchAuction =>
  ({
    chainId: 168587773,
    baseToken: {
      symbol: "ZYN",
      decimals: 18,
      name: "Zyn Token",
      address: "0x08b87749b379f5bca1d74a7b3d4e9f3ded41c706",
      chainId: 168587773,
    },
    quoteToken: {
      symbol: "USDC",
      decimals: 18,
      name: "USDC Token",
      address: "0xe292cf4e316191cbfebd74909356df3cd9455e96",
      chainId: 168587773,
    },
    callbacks: "0x0000000000000000000000000000000000000000",
    status: "settled",
    auctionInfo: {
      name: "Zyn Protocol",
      description:
        "The real ZYN coin. Join us ZYNNERs and be a part of the best attempt at bringing nicotine on-chain",
      links: {
        projectLogo:
          "https://www.fandfwholesale.com/media/catalog/product/cache/1ecf0a9687bd7fb333e2e3dda40a5d04/z/y/zyn_nicotine_pouches_cool_mint_6mg.jpg",
        website: "https://example.com/",
        twitter: "https://example.com/",
        discord: "https://example.com/",
        farcaster: "https://example.com/",
        payoutTokenLogo:
          "https://www.fandfwholesale.com/media/catalog/product/cache/1ecf0a9687bd7fb333e2e3dda40a5d04/z/y/zyn_nicotine_pouches_cool_mint_6mg.jpg",
      },
    },
    // auctionData?: EMPAuctionData | FixedPriceAuctionData,
    // formatted?: AuctionFormattedInfo,
    id: "blast-sepolia-0x1234567890123456789012345678901234567890-1",
    chain: "blast-sepolia",
    auctionHouse: "0x1234567890123456789012345678901234567890",
    lotId: "1",
    createdBlockNumber: "12345678",
    createdBlockTimestamp: "1622000000",
    createdDate: "2023-05-15T10:00:00.000Z",
    createdTransactionHash:
      "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    capacityInitial: "1000",
    start: "1715186981",
    conclusion: "1715274000",
    auctionType: AuctionType.FIXED_PRICE_BATCH,
    seller: "0x0987654321098765432109876543210987654321",
    derivativeType: null,
    wrapDerivative: false,
    curator: "0x1111111111111111111111111111111111111111",
    curatorApproved: true,
    curatorFee: "50",
    protocolFee: "25",
    referrerFee: "10",
    capacity: "800",
    sold: "200",
    purchased: "200",
    lastUpdatedBlockNumber: "12345679",
    lastUpdatedBlockTimestamp: "1622000060",
    lastUpdatedDate: "2023-05-15T10:01:00.000Z",
    lastUpdatedTransactionHash:
      "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    maxBidId: "1",
    linearVesting: null,
    created: {
      infoHash: "QmabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRST",
    },
    curated: {
      curator: "0x1111111111111111111111111111111111111111",
    },
    bids: [
      {
        bidId: "1",
        bidder: "0x4444444444444444444444444444444444444444",
        blockTimestamp: "1622000030",
        date: "2023-05-15T10:00:30.000Z",
        amountIn: "100",
        rawAmountIn: "100000000000000000000",
        rawAmountOut: "200000000",
        rawMarginalPrice: "500000000000000000",
        rawSubmittedPrice: "600000000000000000",
        submittedPrice: "600",
        settledAmountIn: "100",
        settledAmountInRefunded: null,
        settledAmountOut: "200",
        status: "settled",
        outcome: "filled",
        referrer: "0x5555555555555555555555555555555555555555",
        claimed: {
          id: "1",
        },
      },
    ],
    bidsDecrypted: [
      {
        id: "1",
      },
    ],
    bidsClaimed: [
      {
        id: "1",
      },
    ],
    bidsRefunded: [],
    fixedPrice: {
      id: "1",
      status: "settled",
      settlementSuccessful: true,
      minFilled: "200",
      price: "500",
    },
    settled: {
      id: "1",
    },
    ...overrides,
  }) satisfies BatchAuction;

export { getBatchAuctionMock, getFixedPriceBatchAuctionMock };
