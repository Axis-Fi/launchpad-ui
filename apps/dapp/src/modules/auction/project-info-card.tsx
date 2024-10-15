import { Link, Metric, cn } from "@repo/ui";
import { PropsWithAuction } from "@repo/types";
import { getLinkUrl } from "./utils/auction-details";
import { AuctionMetric } from "./auction-metric";
import { allowedCurators } from "@repo/env";
import ExternalLink from "components/external-link";

export function ProjectInfoCard({
  auction,
  ...props
}: PropsWithAuction & React.HTMLAttributes<HTMLDivElement>) {
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
    <div
      className={cn(props.className, "flex h-full flex-col justify-between")}
      title={``}
    >
      <div className="mb-4 flex">{description}</div>
      <div className="flex items-end justify-between space-x-4">
        {auction.curatorApproved && (
          <div className="mt-8 flex gap-x-[68px]">
            <AuctionMetric
              className="mt-8"
              size="s"
              id="curator"
              auction={auction}
            />
            {curator?.reportURL && (
              <Metric size="s" label={"Report"}>
                <ExternalLink href={curator.reportURL}>
                  Read more here
                </ExternalLink>
              </Metric>
            )}
          </div>
        )}
        <div className="flex gap-x-4">
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
      </div>
    </div>
  );
}
