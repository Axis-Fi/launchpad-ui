import type { CreateAuctionForm } from "../../../src/pages/create-auction-page";
const ONE_WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

export const launch: CreateAuctionForm = {
  minFillPercent: [50],
  auctionType: "FPBA",
  start: new Date(),
  deadline: new Date(Date.now() + ONE_WEEK_IN_MS),
  dtlProceedsPercent: [100],
  baselineFloorReservesPercent: [50],
  baselineFloorRangeGap: "0",
  baselineAnchorTickU: "0",
  baselineAnchorTickWidth: "10",
  name: "Fixed Price Batch Test",
  tagline: "We're testing the future of finance",
  projectLogo:
    "https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_gradient_48px-512.png",
  projectBanner:
    "https://blog.adobe.com/en/publish/2021/08/17/media_1faf68d6c67e20f5e45d65217e0d013dcfe537263.png?width=750&format=png&optimize=medium",
  website: "https://google.com",
  discord: "https://google.com",
  twitter: "https://google.com",
  farcaster: "https://google.com",
  description:
    "Fixed price batch tests are a great way to test the future of finance",
  payoutToken: {
    decimals: 18,
    symbol: "USDC",
    address: "0x4F3cf5D09a3e47BF9d6A9D295E4A643C79c43429",
    chainId: 421614,
    totalSupply: "1031198000",
    logoURI: "http://google.com",
  },
  quoteToken: {
    symbol: "USDC",
    logoURI:
      "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/USDC.png",
    decimals: 18,
    address: "0x4f3cf5d09a3e47bf9d6a9d295e4a643c79c43429",
    chainId: 421614,
  },
  capacity: "111",
  referrerFee: [1],
  payoutTokenBalance: "43772.5",
  price: "1",
};
