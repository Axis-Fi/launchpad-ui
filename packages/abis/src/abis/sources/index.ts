import catalogue from "./Catalogue.json";
import auctionHouse from "./BlastAuctionHouse.json";
import linearVesting from "./BlastLinearVesting.json";
import empam from "./EncryptedMarginalPriceAuctionModule.json";
import fpam from "./FixedPriceAuctionModule.json";

export default {
  catalogue,
  auctionHouse,
  linearVesting,
  empam,
  fpam,
} as const;
