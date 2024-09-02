import { useAccount } from "wagmi";
import {
  AuctionDerivativeTypes,
  type Address,
  type BatchAuction,
  type PropsWithAuction,
} from "@repo/types";
import { NotConnectedClaimCard } from "./not-connected";
import { VestingCard } from "./vesting-card";
import { AuctionFailedCard } from "../auction-failed-card";
import { hasDerivative } from "../utils/auction-details";
import { NoUserBidsCard } from "./no-user-bids-card";
import { UserBidsCard } from "./user-bids-card";

type VestingStateParams = {
  auction: BatchAuction;
  isWalletConnected: boolean;
  userAddress?: Address;
};

type VestingCardState =
  | "NOT_CONNECTED"
  | "AUCTION_FAILED"
  | "USER_HAS_NO_BIDS"
  | "USER_HAS_BIDS"
  | "ERROR";

const getVestingCardStatus = ({
  auction,
  isWalletConnected,
  userAddress,
}: VestingStateParams): VestingCardState => {
  const isAuctionCleared = auction.formatted?.cleared ?? true;
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
    return "USER_HAS_BIDS";
  }

  if (!userHasBids) {
    return "USER_HAS_NO_BIDS";
  }

  return "ERROR";
};

export function VestingCardContainer({ auction: _auction }: PropsWithAuction) {
  const auction = _auction as BatchAuction; /* TODO: sort out auction types */

  const { address: userAddress, isConnected: isWalletConnected } = useAccount();

  const status = getVestingCardStatus({
    auction,
    userAddress,
    isWalletConnected,
  });

  switch (status) {
    case "NOT_CONNECTED": {
      return <NotConnectedClaimCard auction={auction} />;
    }

    case "AUCTION_FAILED": {
      return <AuctionFailedCard auction={auction} />;
    }

    case "USER_HAS_BIDS": {
      return (
        <>
          <VestingCard auction={auction} />
          <UserBidsCard auction={auction} />
        </>
      );
    }

    case "USER_HAS_NO_BIDS": {
      return <NoUserBidsCard />;
    }

    case "ERROR": {
      return null;
    }

    default: {
      return null;
    }
  }
}
