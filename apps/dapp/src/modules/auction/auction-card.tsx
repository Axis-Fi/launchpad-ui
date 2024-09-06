import { Button, Card, IconedLabel, Skeleton, Text, cn } from "@repo/ui";
import { SocialRow } from "components/social-row";
import { AuctionListed, AuctionType, PropsWithAuction } from "@repo/types";
import { AuctionCardBanner } from "./auction-card-banner";
import { getChainById } from "utils";
import { AuctionMetricsContainer } from "./auction-metrics-container";
import { AuctionMetric } from "./auction-metric";
import { AuctionStatusBadge } from "./auction-status-badge";
import React from "react";
import { Link } from "react-router-dom";
import { getAuctionPath } from "utils/router";
import { getLinkUrl } from "./utils/auction-details";

type AuctionCardConditionalProps =
  | { loading: true; auction?: never }
  | { loading?: false; auction: AuctionListed };

type AuctionCardProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Whether the card renders in list or grid view */
  isGrid?: boolean;
  /** Added to control the button in previews */
  disabledViewButton?: boolean;
} & AuctionCardConditionalProps;

export function AuctionCard({ auction, ...props }: AuctionCardProps) {
  return (
    <Card
      className={cn(
        "border-surface-tertiary hover:bg-surface-tertiary group size-full overflow-hidden hover:border-neutral-400",
        props.isGrid ? "relative h-[400px] gap-y-3 lg:min-w-[400px]" : "p-8",
        props.className,
      )}
    >
      {props.loading || !auction ? (
        <Skeleton className="h-[332px] w-full" />
      ) : (
        <div
          className={cn(
            "flex h-full gap-x-8",
            props.isGrid ? "flex-col" : "*:w-1/2",
          )}
        >
          <AuctionCardBanner
            auction={auction}
            image={getLinkUrl("projectBanner", auction)}
            chain={getChainById(auction?.chainId)}
            deadline={new Date(Number(auction.conclusion) * 1000)}
            isGrid={props.isGrid}
          />
          <AuctionCardDetails
            isGrid={props.isGrid}
            auction={auction}
            disabledViewButton={props.disabledViewButton}
          />
        </div>
      )}
    </Card>
  );
}

function AuctionCardDetails(
  props: PropsWithAuction & {
    isGrid?: boolean;
    disabledViewButton?: boolean;
  },
) {
  const isEMP = props.auction.auctionType === AuctionType.SEALED_BID;
  const isFPB = props.auction.auctionType === AuctionType.FIXED_PRICE_BATCH;
  const hasCurator = !!props.auction.curator && props.auction.curatorApproved;

  const externalSite = getLinkUrl("externalSite", props.auction);

  return (
    <div
      className={cn("flex flex-col justify-between", props.isGrid && "h-1/2")}
    >
      <div>
        <div
          className={cn("flex justify-between", props.isGrid && "items-center")}
        >
          <IconedLabel
            large
            alt={props.auction.baseToken.symbol}
            src={getLinkUrl("projectLogo", props.auction)}
          >
            {props.auction.info?.name}
          </IconedLabel>

          <AuctionStatusBadge
            large={!props.isGrid}
            className={cn(!props.isGrid && "-mr-3 -mt-4")}
            status={props.auction.status}
          />
        </div>
        <SocialRow
          className="py-6"
          iconClassName={"size-8"}
          discord={getLinkUrl("discord", props.auction)}
          twitter={getLinkUrl("twitter", props.auction)}
          website={getLinkUrl("website", props.auction)}
        />
        <div className="flex h-full flex-col items-start text-wrap">
          <Text color="secondary" className="hidden group-hover:block">
            {props.auction.info?.description}
          </Text>
          <Text color="secondary" className="group-hover:hidden">
            {props.auction.info?.tagline}
          </Text>
        </div>
      </div>

      {isEMP && !props.isGrid && (
        <AuctionMetricsContainer
          className="group-hover:hidden md:grid-cols-2"
          auction={props.auction}
        >
          <AuctionMetric id="targetRaise" />
          <AuctionMetric id="minRaise" />
          <AuctionMetric id="minPrice" size="s" />
          <AuctionMetric id="tokensAvailable" size="s" />
          {hasCurator && <AuctionMetric id="curator" size="s" />}
        </AuctionMetricsContainer>
      )}

      {isFPB && !props.isGrid && (
        <AuctionMetricsContainer
          className="group-hover:hidden md:grid-cols-2"
          auction={props.auction}
        >
          <AuctionMetric id="totalSupply" />
          <AuctionMetric id="capacity" />
          <AuctionMetric id="fixedPrice" size="s" />
          <AuctionMetric id="tokensAvailable" size="s" />
          {hasCurator && <AuctionMetric id="curator" size="s" />}
        </AuctionMetricsContainer>
      )}

      <div
        className={cn(
          "items-end justify-between",
          !props.isGrid && "hidden group-hover:flex",
        )}
      >
        {props.auction.curatorApproved && !props.isGrid && (
          <AuctionMetric size="s" id="curator" auction={props.auction} />
        )}

        <Link
          className={cn("self-end")}
          to={externalSite ?? getAuctionPath(props.auction)}
        >
          <Button
            disabled={props.disabledViewButton}
            size={props.isGrid ? "sm" : "lg"}
            className={cn(
              "self-end uppercase transition-all ",
              props.isGrid &&
                "absolute bottom-0 right-0 mb-3 mr-3 opacity-0 group-hover:opacity-100",
            )}
          >
            View Auction
          </Button>
        </Link>
      </div>
    </div>
  );
}
