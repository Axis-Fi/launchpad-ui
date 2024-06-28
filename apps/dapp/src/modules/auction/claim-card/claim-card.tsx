import { useAccount } from "wagmi";
import {
  AuctionDerivativeTypes,
  type Address,
  type BatchAuction,
  type PropsWithAuction,
} from "@repo/types";
import { NotConnectedClaimCard } from "./not-connected";
import { NoUserBidsClaimCard } from "./no-user-bids-claim-card";
import { UserBidsClaimCard } from "./user-bids-claim-card";
import { VestingClaimCard } from "./vesting-claim-card";
import { AuctionFailedClaimCard } from "./auction-failed-claim-card";
import { hasDerivative } from "../utils/auction-details";

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
  const auctionIsVesting = hasDerivative(
    AuctionDerivativeTypes.LINEAR_VESTING,
    auction,
  );
  const userHasVesting = auctionIsVesting && userHasBids;

  if (!isWalletConnected) {
    return "NOT_CONNECTED";
  }

  if (!isAuctionCleared || isAuctionCancelled) {
    return "AUCTION_FAILED";
  }

  if (userHasVesting) {
    return "VESTING";
  }

  if (userHasBids) {
    return "USER_HAS_BIDS";
  }

  return "USER_HAS_NO_BIDS";
};

export function ClaimCard({ auction: _auction }: PropsWithAuction) {
  const auction = _auction as BatchAuction; /* TODO: sort out auction types */

  const { address: userAddress, isConnected: isWalletConnected } = useAccount();

  const status = getClaimStatus({ auction, userAddress, isWalletConnected });

  switch (status) {
    case "NOT_CONNECTED": {
      return <NotConnectedClaimCard auction={auction} />;
    }

    case "AUCTION_FAILED": {
      return <AuctionFailedClaimCard auction={auction} />;
    }

    case "USER_HAS_BIDS": {
      return <UserBidsClaimCard auction={auction} />;
    }

    case "VESTING": {
      return <VestingClaimCard auction={auction} />;
    }

    default: {
      return <NoUserBidsClaimCard />;
    }
  }
}
