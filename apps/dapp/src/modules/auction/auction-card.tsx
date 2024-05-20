import { Card, IconedLabel, Skeleton, Text } from "@repo/ui";
import { SocialRow } from "components/social-row";
import { AuctionListed, AuctionType, PropsWithAuction } from "@repo/types";
import { AuctionCardBanner } from "./auction-card-banner";
import { getChainById } from "utils";
import { AuctionMetricsContainer } from "./auction-metrics-container";
import { AuctionMetric } from "./auction-metric";

type AuctionCardProps = React.HTMLAttributes<HTMLDivElement> & {
  auction: AuctionListed;
  loading?: boolean;
};

export function AuctionCard({ auction, ...props }: AuctionCardProps) {
  const chain = getChainById(auction.chainId);

  return (
    <Card className="size-full">
      {props.loading ? (
        <Skeleton className="h-[364px] w-full" />
      ) : (
        <div className="flex gap-x-8 py-4 *:w-1/2">
          <AuctionCardBanner
            //TODO: replace with a better named property, likely projectBanner
            image={auction.auctionInfo?.links?.projectLogo}
            deadline={auction.formatted.endDate}
            chain={chain}
          />
          <AuctionCardDetails auction={auction} />
        </div>
      )}
    </Card>
  );
}

function AuctionCardDetails(props: PropsWithAuction) {
  const isEMP = props.auction.auctionType === AuctionType.SEALED_BID;
  return (
    <div className="flex flex-col justify-between">
      <div>
        <IconedLabel large src={props.auction.auctionInfo?.links?.projectLogo}>
          {props.auction.auctionInfo?.name}
        </IconedLabel>
        <SocialRow {...props.auction.auctionInfo?.links} />
        <Text color="secondary">{props.auction.auctionInfo?.description}</Text>
      </div>

      {isEMP && (
        <AuctionMetricsContainer auction={props.auction}>
          <AuctionMetric id="targetRaise" />
          <AuctionMetric id="minRaise" />
          <AuctionMetric small id="minPrice" />
          <AuctionMetric small id="auctionnedSupply" />
        </AuctionMetricsContainer>
      )}
    </div>
  );
}
