import { useParams } from "react-router-dom";
import { AuctionStatus } from "src/types";
import {
  AuctionConcluded,
  AuctionCreated,
  AuctionDecrypted,
  AuctionLive,
  AuctionSettled,
} from "modules/auction/status";
import { useAuction } from "loaders/useAuction";
import { Avatar, Skeleton } from "@repo/ui";
import { SocialRow } from "components/social-row";
import { ProjectInfoCard } from "modules/auction/project-info-card";
import { ContractAddressCard } from "modules/auction/contract-address-card";
import { axisContracts } from "@repo/contracts";
import { Address } from "viem";
import { PageHeader } from "components/page-header";
import { AuctionInfoCard } from "modules/auction/auction-info-card";
import { AuctionBidsCard } from "modules/auction/auction-bids";
import { PropsWithAuction } from "modules/auction";

const statuses: Record<
  AuctionStatus,
  (props: PropsWithAuction) => JSX.Element
> = {
  created: AuctionCreated,
  live: AuctionLive,
  concluded: AuctionConcluded,
  decrypted: AuctionDecrypted,
  settled: AuctionSettled,
};

/** Displays Auction details and status*/
export default function AuctionPage() {
  const params = useParams();

  const { result: auction, isLoading: isAuctionLoading } = useAuction(
    params.id,
  );

  if (isAuctionLoading) {
    return <AuctionPageLoading />;
  }

  if (!auction) throw new Error("Auction doesn't exist");

  const contracts = axisContracts.addresses[auction.chainId];
  const AuctionElement = statuses[auction.status];
  console.log({ auction });

  return (
    <div>
      <PageHeader />
      <div className="bg-secondary rounded-sm p-4">
        <div className="flex items-center gap-x-1">
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
      <div className="mt-5">
        <AuctionElement auction={auction} />
      </div>

      <div className="mt-8 flex justify-between gap-x-4">
        <ProjectInfoCard className="w-[50%]" auction={auction} />
        <ContractAddressCard
          chainId={auction.chainId}
          addresses={[
            [auction.baseToken.symbol, auction.baseToken.address as Address],
            [auction.quoteToken.symbol, auction.quoteToken.address as Address],
            ["Auction House", contracts.auctionHouse],
          ]}
        />
      </div>

      <AuctionBidsCard
        className="mt-12"
        auction={auction}
        isLoading={isAuctionLoading}
      />
    </div>
  );
}

function AuctionPageLoading() {
  return (
    <div className="mask">
      <PageHeader />
      <div>
        <div className="bg-secondary rounded-sm p-4">
          <div className="flex items-center gap-x-1">
            <Skeleton className="size-12 rounded-full" />
            <h1>Loading...</h1>
          </div>
          <Skeleton className="mt-2 h-4 w-16" />
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
