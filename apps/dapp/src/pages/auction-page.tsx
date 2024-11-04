import React from "react";
import { useParams } from "react-router-dom";
import { Button, Skeleton, Text, cn, useToggle } from "@repo/ui";
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
  AuctionSettled,
  AuctionLive,
} from "modules/auction/status";
import { PageContainer } from "modules/app/page-container";
import { FixedPriceBatchAuctionConcluded } from "modules/auction/status/auction-concluded-fixed-price-batch";
import { BidList } from "modules/auction/bid-list";
import { PurchaseList } from "modules/auction/purchase-list";
import { Countdown } from "modules/auction/countdown";
import AuctionProgressBar from "modules/auction/auction-progress-bar";
import { getLinkUrl } from "modules/auction/utils/auction-details";
import { useAccount, useSwitchChain } from "wagmi";

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
  const { isConnected, chainId: connectedChainId } = useAccount();
  const { switchChain } = useSwitchChain();

  const { result: auction, isLoading: isAuctionLoading } = useAuction(
    chainId!,
    lotId!,
  );

  //TODO: improve this check
  const isUSDQuote =
    auction && auction.quoteToken.symbol.toLowerCase().includes("usd");

  const toggle = useToggle();

  //Forcefully switch chain
  React.useEffect(() => {
    const auctionChainId = +chainId!;

    if (isConnected && auctionChainId !== connectedChainId) {
      switchChain({ chainId: +chainId! });
    }
  }, [isConnected]);

  //Enforce showing as quote token when it's a USD stable
  React.useEffect(() => {
    if (auction && isUSDQuote && toggle.isToggled) {
      toggle.toggle();
    }
  }, [auction]);

  if (isAuctionLoading) return <AuctionPageLoading />;
  if (!auction || !auction.isSecure) return <AuctionPageMissing />;

  const isFPA = auction.auctionType === AuctionType.FIXED_PRICE_BATCH;

  //TODO: check wen to display
  const showBidHistory = !["created", "live"].includes(auction.status);

  const AuctionElement =
    auction.status === "concluded" && isFPA
      ? FixedPriceBatchAuctionConcluded
      : statuses[auction.status];

  return (
    <PageContainer id="__AXIS_LAUNCH_PAGE__" className="pt-0 lg:pb-20 lg:pt-0">
      <AuctionPageView auction={auction} isAuctionLoading={isAuctionLoading}>
        <PageHeader
          className="relative mt-0 lg:mt-0"
          backNavigationPath="/#"
          backNavigationText="Back to Launches"
          toggle={!isUSDQuote}
          toggleSymbol={auction.quoteToken.symbol}
        >
          <Countdown auction={auction} />
        </PageHeader>
        <div className="lg:mt-10">
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
  return (
    <>
      <ImageBanner
        isLoading={isAuctionLoading}
        imgUrl={getLinkUrl("projectBanner", auction)}
      >
        <div className="max-w-limit flex h-full w-full flex-row flex-wrap">
          <div className="mb-10 flex w-full flex-col items-center justify-end">
            <div className="relative mb-2 self-center text-center">
              <div className="border-primary absolute inset-0 top-3 -z-10 -ml-10 size-full w-[120%] border bg-neutral-950 blur-2xl" />
              <Text size="7xl" mono className="text-neutral-200">
                {auction.info?.name}
              </Text>

              <Text
                size="3xl"
                color="secondary"
                className={cn("mx-auto w-fit text-nowrap text-neutral-200")}
              >
                {!isAuctionLoading && auction.info?.tagline}
              </Text>
            </div>
            <AuctionProgressBar auction={auction} />
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
