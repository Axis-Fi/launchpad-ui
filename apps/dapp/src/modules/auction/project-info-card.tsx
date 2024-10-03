import { Card, Link, Metric } from "@repo/ui";
import { PropsWithAuction } from "@repo/types";
import { ReferrerPopover } from "modules/referral/referrer-popover";
import { getLinkUrl } from "./utils/auction-details";
import { AuctionMetric } from "./auction-metric";
import { allowedCurators } from "@repo/env";
import ExternalLink from "components/external-link";

type ProjectInfoCardProps = PropsWithAuction &
  React.HTMLAttributes<HTMLDivElement> & {
    canRefer?: boolean;
  };

export function ProjectInfoCard({
  auction,
  canRefer = true,
  ...props
}: ProjectInfoCardProps) {
  const description =
    auction.info?.description ?? "No description found for this project.";

  const website = getLinkUrl("website", auction);
  const twitter = getLinkUrl("twitter", auction);
  const discord = getLinkUrl("discord", auction);
  const farcaster = getLinkUrl("farcaster", auction);
  const curator = allowedCurators.find(
    (c) => c.address.toLowerCase() === auction.curator?.toLowerCase(),
  );

  return (
    <Card
      className={props.className}
      title={`About ${auction.info?.name || ""}`}
      headerRightElement={canRefer && <ReferrerPopover auction={auction} />}
    >
      <div className="mb-4 flex">{description}</div>
      <div className="flex-start flex space-x-4">
        {twitter && (
          <Link className="text-primary flex" href={twitter}>
            <img
              src="/images/twitter-logo.svg"
              alt="twitter logo"
              width="35px"
            />
          </Link>
        )}
        {discord && (
          <Link className="text-primary flex" href={discord}>
            <img
              src="/images/discord-logo.svg"
              alt="discord logo"
              width="35px"
            />
          </Link>
        )}
        {farcaster && (
          <Link className="text-primary flex" href={farcaster}>
            <img
              src="/images/farcaster-logo.svg"
              alt="farcaster logo"
              width="35px"
            />
          </Link>
        )}
        {website && (
          <Link className="text-primary flex" href={website}>
            <img src="/images/web-logo.svg" alt="web logo" width="35px" />
          </Link>
        )}
      </div>
      {auction.curatorApproved && (
        <div className="mt-8 flex gap-x-[68px]">
          <AuctionMetric
            className="mt-8"
            size="s"
            id="curator"
            auction={auction}
          />
          {curator?.reportURL && (
            <Metric size="s" label={"Notes"}>
              <ExternalLink href={curator.reportURL}>
                Read more here
              </ExternalLink>
            </Metric>
          )}
        </div>
      )}
    </Card>
  );
}
