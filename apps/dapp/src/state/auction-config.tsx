import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { CreateAuctionForm } from "pages/create-auction-page";

export const auctionConfig = atomWithStorage<CreateAuctionForm | null>(
  "create-auction",
  null,
);

export const useStoredAuctionConfig = () => useAtom(auctionConfig);
