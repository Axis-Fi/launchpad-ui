import { Card, Link } from "@repo/ui";
import { PropsWithAuction } from "@repo/types";

export function ProjectInfoCard({
  auction,
  ...props
}: PropsWithAuction & React.HTMLAttributes<HTMLDivElement>) {
  const description =
    auction.auctionInfo?.description ??
    "No description found for this project.";

  const website = auction.auctionInfo?.links?.website;
  const twitter = auction.auctionInfo?.links?.twitter;
  const discord = auction.auctionInfo?.links?.discord;
  const farcaster = auction.auctionInfo?.links?.farcaster;

  return (
    <Card
      className={props.className}
      title={`About ${auction.auctionInfo?.name || ""}`}
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
    </Card>
  );
}
