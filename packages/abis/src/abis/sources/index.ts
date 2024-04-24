import catalogue from "./Catalogue.json";
import auctionHouse from "./AuctionHouse.json";
import linearVesting from "./LinearVesting.json";
import empam from "./EncryptedMarginalPriceAuctionModule.json";
import fpam from "./FixedPriceAuctionModule.json";
import testnetERC20 from "./TestnetERC20.json";

//Fetch errors from modules to include in the AuctionHouse ABI
const errors = [empam.abi, fpam.abi, linearVesting.abi].flatMap((e) =>
  e.filter((e) => e.type === "error"),
);

const _auctionHouse = {
  abi: [...auctionHouse.abi, ...errors],
} as const;

export { testnetERC20 };
export default {
  catalogue,
  auctionHouse: _auctionHouse,
  linearVesting,
  empam,
  fpam,
} as const;
