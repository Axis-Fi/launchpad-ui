import { useAccount } from "wagmi";
import type { Address, Auction, BatchAuction } from "@repo/types";
import { NotConnected } from "./not-connected";
import { UserHasNoBids } from "./user-has-no-bids";
import { UserHasBids } from "./user-has-bids";
import { Vesting } from "./vesting";

type ClaimProps = {
  auction: Auction;
};

type ClaimStatusProps = {
  auction: BatchAuction;
  isWalletConnected: boolean;
  userAddress?: Address;
};

type ClaimStatus =
  | "NOT_CONNECTED"
  | "AUCTION_FAILED"
  | "USER_HAS_BIDS"
  | "USER_HAS_NO_BIDS"
  | "VESTING";

const getClaimStatus = ({
  auction,
  isWalletConnected,
  userAddress,
}: ClaimStatusProps): ClaimStatus => {
  const isAuctionCleared = auction.formatted?.cleared;
  const isAuctionCancelled = false; // TODO: obtain this value
  const userHasBids = auction.bids.some(
    (bid) => bid.bidder.toLowerCase() === userAddress?.toLowerCase(),
  );
  const isVesting = false; // TODO: obtain this value

  if (!isWalletConnected) {
    return "NOT_CONNECTED";
  }

  if (!isAuctionCleared || isAuctionCancelled) {
    return "AUCTION_FAILED";
  }

  if (userHasBids) {
    return "USER_HAS_BIDS";
  }

  if (isVesting) {
    return "VESTING";
  }

  return "USER_HAS_NO_BIDS";
};

export function ClaimCard({ auction: _auction }: ClaimProps) {
  const auction = _auction as BatchAuction; /* TODO: sort out auction types */

  const { address: userAddress, isConnected: isWalletConnected } = useAccount();

  const status = getClaimStatus({ auction, userAddress, isWalletConnected });

  switch (status) {
    case "NOT_CONNECTED": {
      return <NotConnected auction={auction} />;
    }

    case "AUCTION_FAILED": {
      return "//TODO";
    }

    case "USER_HAS_BIDS": {
      return <UserHasBids auction={auction} />;
    }

    case "VESTING": {
      return <Vesting />;
    }

    default: {
      return <UserHasNoBids />;
    }
  }
}
