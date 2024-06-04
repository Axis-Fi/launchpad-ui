import { useParams } from "react-router-dom";
import { useAccount } from "wagmi";
import { Button, Skeleton, Text } from "@repo/ui";
import {
  type PropsWithAuction,
  type AuctionStatus,
  AuctionType,
} from "@repo/types";
import { useAuction } from "modules/auction/hooks/use-auction";
import { PageHeader } from "modules/app/page-header";
import { AuctionBidsCard } from "modules/auction/auction-bids";
import { ImageBanner } from "components/image-banner";
import {
  AuctionConcluded,
  AuctionCreated,
  AuctionDecrypted,
  AuctionLive,
  AuctionSettled,
} from "modules/auction/status";
import { PageContainer } from "modules/app/page-container";
import { ReloadButton } from "components/reload-button";
import { FixedPriceAtomicAuctionConcluded } from "modules/auction/status/auction-concluded-fixed-price-atomic";
import { FixedPriceBatchAuctionConcluded } from "modules/auction/status/auction-concluded-fixed-price-batch";

const statuses: Record<
  AuctionStatus,
  (props: PropsWithAuction) => JSX.Element
> = {
  created: AuctionCreated,
  live: AuctionLive,
  concluded: AuctionConcluded,
  decrypted: AuctionDecrypted,
  settled: AuctionSettled,
  cancelled: () => <></>, // not displayed
};

/** Displays Auction details and status*/
export default function AuctionPage() {
  const { id, type } = useParams();
  const { address } = useAccount();

  const {
    result: auction,
    isLoading: isAuctionLoading,
    refetch,
    isRefetching,
  } = useAuction(id!, type as AuctionType);

  if (isAuctionLoading) {
    return <AuctionPageLoading />;
  }

  if (!auction || !auction.isSecure) return <AuctionPageMissing />;

  const AuctionElement =
    auction.status === "concluded" &&
    auction.auctionType === AuctionType.FIXED_PRICE
      ? FixedPriceAtomicAuctionConcluded
      : auction.status === "concluded" &&
          auction.auctionType === AuctionType.FIXED_PRICE_BATCH
        ? FixedPriceBatchAuctionConcluded
        : statuses[auction.status];

  return (
    <>
      <ImageBanner imgUrl={auction.auctionInfo?.links?.projectLogo}>
        <div className="mb-10">
          <Text size="7xl" mono>
            {auction.auctionInfo?.name}
          </Text>

          <Text
            size="3xl"
            color="secondary"
            className="mx-auto w-fit text-nowrap"
          >
            send copy plis mi familia
          </Text>
        </div>
      </ImageBanner>

      <PageContainer>
        <PageHeader>
          <ReloadButton refetching={isRefetching} onClick={() => refetch()} />
        </PageHeader>

        <AuctionElement auction={auction} />

        <AuctionBidsCard
          auction={auction}
          isLoading={isAuctionLoading}
          address={address}
        />
      </PageContainer>
    </>
  );
}

function AuctionPageLoading() {
  /* TODO skeletons not working since redesign */
  return (
    <div className="mask">
      <ImageBanner />
      <PageContainer>
        <PageHeader />
        <div>
          <div className="bg-secondary rounded-sm p-4 ">
            <Skeleton className="h-22 mt-20 w-full" />
          </div>

          <div className="mt-5">
            <div className="flex justify-between gap-x-4">
              <Skeleton className="h-72 w-[40%]" />
            </div>
          </div>
          <Text size="lg" className="mt-5">
            About
          </Text>
          <Skeleton className="h-32 w-[40%]" />
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
