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
import { FixedPriceBatchAuctionConcluded } from "modules/auction/status/auction-concluded-fixed-price-batch";
import { BidList } from "modules/auction/bid-list";
import { PurchaseList } from "modules/auction/purchase-list";
import { getLinkUrl } from "modules/auction/utils/auction-details";
import { Countdown } from "modules/auction/countdown";
import { AuctionBaselineLive } from "modules/auction/status/auction-baseline-live";

const statuses: Record<
  AuctionStatus,
  (props: PropsWithAuction) => React.ReactNode
> = {
  registering: () => null, // Registration state is not handled in this component, but in auction-registering.tsx
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

  const { result: auction, isLoading: isAuctionLoading } = useAuction(
    chainId!,
    lotId!,
  );

  if (isAuctionLoading) {
    return <AuctionPageLoading />;
  }

  if (!auction || !auction.isSecure) return <AuctionPageMissing />;
  const isFPA = auction.auctionType === AuctionType.FIXED_PRICE_BATCH;
  //TODO: implement
  const showBidHistory = false;

  //TODO: implement check
  const isBaseline = true;

  const AuctionElement =
    auction.status === "concluded" && isFPA
      ? FixedPriceBatchAuctionConcluded
      : isBaseline
        ? AuctionBaselineLive
        : statuses[auction.status];

  return (
    <PageContainer id="__AXIS_ORIGIN_LAUNCH_PAGE__" className="mb-20">
      <AuctionPageView auction={auction} isAuctionLoading={isAuctionLoading}>
        <PageHeader
          className="mt-0 lg:mt-0"
          backNavigationPath="/#"
          backNavigationText="Back to Launches"
          toggle
          toggleSymbol={auction.quoteToken.symbol}
        >
          <Countdown auction={auction} />
        </PageHeader>
        <div className="mt-10">
          <AuctionElement auction={auction} />
        </div>
      </AuctionPageView>
      {auction.status !== "created" &&
        auction.status !== "registering" &&
        showBidHistory &&
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
          <div className="flex w-full flex-col justify-end">
            <div className="mb-10 self-center text-center">
              <Text
                size="7xl"
                mono
                className={cn(textColor === "light" && "text-background")}
              >
                {!isAuctionLoading && auction.info?.name}
              </Text>

              <Text
                size="3xl"
                color="secondary"
                className={cn(
                  "mx-auto w-fit text-nowrap",
                  textColor === "light" && "text-background",
                )}
              >
                {!isAuctionLoading && auction.info?.tagline}
              </Text>
            </div>
          </div>
        </div>
      </ImageBanner>
      {props.children}
    </>
  );
}

export function AuctionPageLoading() {
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

export function AuctionPageMissing() {
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
