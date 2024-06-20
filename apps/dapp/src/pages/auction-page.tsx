import { useParams } from "react-router-dom";
import { Badge, Button, Skeleton, Text, cn } from "@repo/ui";
import {
  type PropsWithAuction,
  type AuctionStatus,
  AuctionType,
  Auction,
} from "@repo/types";
import { useAuction } from "modules/auction/hooks/use-auction";
import { PageHeader } from "modules/app/page-header";
import { ImageBanner } from "components/image-banner";
import {
  EncryptedMarginalPriceAuctionConcluded,
  AuctionCreated,
  AuctionDecrypted,
  AuctionLive,
  AuctionSettled,
} from "modules/auction/status";
import { PageContainer } from "modules/app/page-container";
import { ReloadButton } from "components/reload-button";
import { FixedPriceBatchAuctionConcluded } from "modules/auction/status/auction-concluded-fixed-price-batch";
import { AuctionStatusBadge } from "modules/auction/auction-status-badge";
import { getCountdown } from "utils/date";
import { useEffect, useState } from "react";
import { BidList } from "modules/auction/bid-list";
import React from "react";

const statuses: Record<
  AuctionStatus,
  (props: PropsWithAuction) => JSX.Element
> = {
  created: AuctionCreated,
  live: AuctionLive,
  concluded: EncryptedMarginalPriceAuctionConcluded,
  decrypted: AuctionDecrypted,
  settled: AuctionSettled,
  cancelled: () => <></>, // not displayed
};

/** Displays Auction details and status*/
export default function AuctionPage() {
  const { id, type } = useParams();

  const {
    result: auction,
    isLoading: isAuctionLoading,
    isRefetching,
    refetch,
  } = useAuction(id!, type as AuctionType);

  // Countdown
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
  const isOngoing =
    auction?.formatted &&
    auction.formatted?.startDate < new Date() &&
    auction.formatted?.endDate > new Date();

  // Refresh the countdown every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (isOngoing && auction.formatted?.endDate) {
        setTimeRemaining(getCountdown(auction.formatted?.endDate));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isOngoing, auction, auction?.formatted?.endDate]);

  if (isAuctionLoading) {
    return <AuctionPageLoading />;
  }

  if (!auction || !auction.isSecure) return <AuctionPageMissing />;

  const AuctionElement =
    auction.status === "concluded" &&
    auction.auctionType === AuctionType.FIXED_PRICE_BATCH
      ? FixedPriceBatchAuctionConcluded
      : statuses[auction.status];

  return (
    <PageContainer>
      <PageHeader backNavigationPath="/#" backNavigationText="Back to Launches">
        <ReloadButton refetching={isRefetching} onClick={() => refetch?.()} />
      </PageHeader>

      <AuctionPageView
        auction={auction}
        isOngoing={isOngoing}
        isAuctionLoading={isAuctionLoading}
        timeRemaining={timeRemaining}
      >
        <AuctionElement auction={auction} />
      </AuctionPageView>
      {auction.status !== "created" && <BidList auction={auction} />}
    </PageContainer>
  );
}

export function AuctionPageView({
  auction,
  isAuctionLoading,
  isOngoing,
  timeRemaining,
  ...props
}: React.PropsWithChildren<{
  auction: Auction;
  isAuctionLoading?: boolean;
  isOngoing?: boolean;
  timeRemaining?: string | null;
}>) {
  const [textColor, setTextColor] = React.useState<string>();

  return (
    <>
      <ImageBanner
        isLoading={isAuctionLoading}
        imgUrl={auction.auctionInfo?.links?.projectBanner}
        onTextColorChange={setTextColor}
      >
        <div className="max-w-limit flex h-full w-full flex-row flex-wrap">
          <div className="flex w-full flex-row justify-end">
            <div className="mr-4 mt-4">
              <AuctionStatusBadge status={auction.status} />
            </div>
          </div>
          <div className="flex w-full flex-col justify-end">
            <div className="self-center text-center align-bottom">
              <Text
                size="7xl"
                mono
                className={cn(textColor === "light" && "text-background")}
              >
                {auction.auctionInfo?.name}
              </Text>

              <Text
                size="3xl"
                color="secondary"
                className={cn(
                  "mx-auto w-fit text-nowrap",
                  textColor === "light" && "text-background",
                )}
              >
                {auction.auctionInfo?.tagline}
              </Text>
            </div>
            <div className="mb-4 ml-4 self-start">
              {isOngoing && (
                <Badge>
                  <div className="ml-2 mr-2 flex flex-col items-center justify-center">
                    <div className="text-center">
                      <Text uppercase mono size="xs" color="secondary">
                        Remaining:
                      </Text>
                    </div>
                    <div className="text-center">{timeRemaining}</div>
                  </div>
                </Badge>
              )}
            </div>
          </div>
        </div>
      </ImageBanner>
      {props.children}
    </>
  );
}

function AuctionPageLoading() {
  return (
    <div>
      <ImageBanner isLoading={true} />
      <PageContainer>
        <PageHeader />
        <div className="mask h-[500px] w-full">
          <Skeleton className="size-full" />
        </div>
      </PageContainer>
    </div>
  );
}

function AuctionPageMissing() {
  const { id, type } = useParams();
  const { refetch } = useAuction(id!, type as AuctionType);

  return (
    <div className="absolute inset-0 -top-40 flex h-full flex-col items-center justify-center text-center">
      <h4>
        This auction doesn&apos;t seem to exist
        <span className="ml-1 italic">yet</span>
      </h4>
      <p className="text-axis-light-mid mt-10 max-w-sm text-xs">
        If you just created it, try refreshing below to see the subgraph has
        indexed it
      </p>
      <Button className="mt-2" onClick={() => refetch()}>
        REFRESH
      </Button>
    </div>
  );
}
