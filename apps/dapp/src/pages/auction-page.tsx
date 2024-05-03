import { useParams } from "react-router-dom";
import { useAccount } from "wagmi";
import type { Address } from "viem";
import { Avatar, Button, Skeleton, Tooltip } from "@repo/ui";
import {
  type PropsWithAuction,
  type AuctionStatus,
  AuctionType,
} from "@repo/types";
import { useAuction } from "modules/auction/hooks/use-auction";
import { SocialRow } from "components/social-row";
import { ProjectInfoCard } from "modules/auction/project-info-card";
import { ContractAddressCard } from "modules/auction/contract-address-card";
import { PageHeader } from "modules/app/page-header";
import { AuctionInfoCard } from "modules/auction/auction-info-card";
import { AuctionBidsCard } from "modules/auction/auction-bids";
import { ImageBanner } from "components/image-banner";
import { ReloadButton } from "components/reload-button";
import {
  AuctionConcluded,
  AuctionCreated,
  AuctionDecrypted,
  AuctionLive,
  AuctionSettled,
} from "modules/auction/status";
import { ChainIcon } from "components/chain-icon";
import { FixedPriceAuctionConcluded } from "modules/auction/status/fixed-price-auction-concluded";
import { getAuctionMetadata } from "modules/auction/metadata";
import { getAuctionHouse } from "utils/contracts";

const statuses: Record<
  AuctionStatus,
  (props: PropsWithAuction) => JSX.Element
> = {
  created: AuctionCreated,
  live: AuctionLive,
  concluded: AuctionConcluded,
  decrypted: AuctionDecrypted,
  //@ts-expect-error Need to update arg type
  settled: AuctionSettled,
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

  if (!auction) return <AuctionPageMissing />;

  const auctionHouse = getAuctionHouse(auction);
  const AuctionElement =
    auction.status === "concluded" &&
    auction.auctionType === AuctionType.FIXED_PRICE
      ? FixedPriceAuctionConcluded
      : statuses[auction.status];

  const metadata = getAuctionMetadata(auction.auctionType);

  return (
    <div>
      <PageHeader>
        <ReloadButton refetching={isRefetching} onClick={() => refetch()} />
      </PageHeader>

      <ImageBanner imgUrl={auction.auctionInfo?.links?.payoutTokenLogo}>
        <div className="relative rounded-sm p-4">
          <div className="flex justify-between">
            <div>
              <div className="flex items-center gap-x-1 ">
                <Avatar
                  className="size-12 text-lg"
                  alt={auction.baseToken.symbol}
                  src={auction.auctionInfo?.links?.payoutTokenLogo}
                />
                <h1 className="text-[40px]">{auction.baseToken.name}</h1>
              </div>
              <SocialRow
                className="gap-x-2"
                {...(auction.auctionInfo?.links ?? {})}
              />
            </div>
            <div className="flex items-start gap-x-1">
              <Tooltip content={metadata.tooltip}>
                <h4>{metadata.label}</h4>
              </Tooltip>
              <ChainIcon chainId={auction.chainId} />
            </div>
          </div>
        </div>
      </ImageBanner>
      <div className="mt-8">
        <AuctionElement auction={auction} />
      </div>

      <div className="mt-8 flex justify-between gap-x-4">
        {auction.status !== "settled" && (
          <ProjectInfoCard className="w-[50%]" auction={auction} />
        )}
        <ContractAddressCard
          chainId={auction.chainId}
          addresses={[
            [
              `Payout (${auction.baseToken.symbol})`,
              auction.baseToken.address as Address,
            ],
            [
              `Quote (${auction.quoteToken.symbol})`,
              auction.quoteToken.address as Address,
            ],
            ["Auction House", auctionHouse.address],
          ]}
        />
      </div>

      <AuctionBidsCard
        className="mt-12"
        auction={auction}
        isLoading={isAuctionLoading}
        address={address}
      />
    </div>
  );
}

function AuctionPageLoading() {
  return (
    <div className="mask">
      <PageHeader />
      <div>
        <div className="bg-secondary rounded-sm p-4 ">
          <Skeleton className="h-22 mt-20 w-full" />
        </div>

        <div className="mt-5">
          <div className="flex justify-between gap-x-4">
            <AuctionInfoCard className="w-1/2">
              <Skeleton className="h-10 w-1/2" />
              <Skeleton className="h-10 w-1/2" />
              <Skeleton className="h-10 w-1/2" />
              <Skeleton className="h-10 w-1/2" />
            </AuctionInfoCard>

            <Skeleton className="h-72 w-[40%]" />
          </div>
        </div>
        <h3 className="mt-5">About</h3>
        <Skeleton className="h-20 w-[40%]" />
        <h3 className="mt-5">Contract Addresses</h3>
        <Skeleton className="h-32 w-[40%]" />
      </div>
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
