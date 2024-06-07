import batchCatalogue from "./BatchCatalogue.json";
import _batchAuctionHouse from "./BatchAuctionHouse.json";
import encryptedMarginalPrice from "./EncryptedMarginalPrice.json";
import fixedPriceBatch from "./FixedPriceBatch.json";
import linearVesting from "./LinearVesting.json";
import testnetERC20 from "./TestnetERC20.json";
import merkleAllowlist from "./MerkleAllowlist.json";
import cappedMerkleAllowlist from "./CappedMerkleAllowlist.json";
import tokenAllowlist from "./TokenAllowlist.json";
import allocatedMerkleAllowlist from "./AllocatedMerkleAllowlist.json";

//Fetch errors from modules to include in the AuctionHouse ABI
const errors = [
  encryptedMarginalPrice.abi,
  fixedPriceBatch.abi,
  linearVesting.abi,
].flatMap((e) => e.filter((e) => e.type === "error"));

//Merge errors
const batchAuctionHouse = {
  abi: [..._batchAuctionHouse.abi, ...errors],
} as const;

export { testnetERC20 };

export default {
  batchCatalogue,
  batchAuctionHouse,
  encryptedMarginalPrice,
  fixedPriceBatch,
  linearVesting,
  merkleAllowlist,
  cappedMerkleAllowlist,
  tokenAllowlist,
  allocatedMerkleAllowlist,
} as const;
