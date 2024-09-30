import React from "react";
import { useParams } from "react-router-dom";
import { Button, Skeleton, Text, cn } from "@repo/ui";
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
import { BidList } from "modules/auction/bid-list";
import { PurchaseList } from "modules/auction/purchase-list";
import { getLinkUrl } from "modules/auction/utils/auction-details";
import { Countdown } from "modules/auction/countdown";

const statuses: Record<
  AuctionStatus,
  (props: PropsWithAuction) => React.ReactNode
> = {
  registering: () => null,
  created: AuctionCreated,
  live: AuctionLive,
  concluded: EncryptedMarginalPriceAuctionConcluded,
  decrypted: AuctionDecrypted,
  settled: AuctionSettled,
  aborted: AuctionSettled,
  cancelled: AuctionSettled,
};

/** Displays Auction details and status*/
export default function AuctionPage() {
  const { chainId, lotId } = useParams();

  const {
    result: auction,
    isLoading: isAuctionLoading,
    isRefetching,
    refetch,
  } = useAuction(chainId!, lotId!);

  if (isAuctionLoading) {
    return <AuctionPageLoading />;
  }

  if (!auction || !auction.isSecure) return <AuctionPageMissing />;
  const isFPA = auction.auctionType === AuctionType.FIXED_PRICE_BATCH;

  const AuctionElement =
    auction.status === "concluded" && isFPA
      ? FixedPriceBatchAuctionConcluded
      : statuses[auction.status];

  return (
    <PageContainer id="__AXIS_ORIGIN_LAUNCH_PAGE__" className="mb-20">
      <PageHeader backNavigationPath="/#" backNavigationText="Back to Launches">
        <ReloadButton refetching={isRefetching} onClick={() => refetch?.()} />
      </PageHeader>

      <AuctionPageView auction={auction} isAuctionLoading={isAuctionLoading}>
        <AuctionElement auction={auction} />
      </AuctionPageView>
      {auction.status !== "created" &&
        (!isFPA ? (
          <BidList auction={auction} />
        ) : (
          <PurchaseList auction={auction} />
        ))}
    </PageContainer>
  );
}

export function AuctionPageView({
  auction,
  isAuctionLoading,
  ...props
}: React.PropsWithChildren<{
  auction: Auction;
  isAuctionLoading?: boolean;
}>) {
  const [textColor, setTextColor] = React.useState<string>();

  return (
    <>
      <ImageBanner
        isLoading={isAuctionLoading}
        imgUrl={getLinkUrl("projectBanner", auction)}
        onTextColorChange={setTextColor}
      >
        <div className="max-w-limit flex h-full w-full flex-row flex-wrap">
          <div className="flex w-full flex-row justify-end">
            <div className="mr-4 mt-4">
              <AuctionStatusBadge status={auction.status} large />
            </div>
          </div>
          <div className="flex w-full flex-col justify-end">
            <div className="self-center text-center align-bottom">
              <Text
                size="7xl"
                mono
                className={cn(textColor === "light" && "text-background")}
              >
                {auction.info?.name}
              </Text>

              <Text
                size="3xl"
                color="secondary"
                className={cn(
                  "mx-auto w-fit text-nowrap",
                  textColor === "light" && "text-background",
                )}
              >
                {auction.info?.tagline}
              </Text>
            </div>
            <div className="mb-4 ml-4 self-start">
              <Countdown auction={auction} />
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
  const { chainId, lotId } = useParams();

  const { refetch } = useAuction(chainId!, lotId!);

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
