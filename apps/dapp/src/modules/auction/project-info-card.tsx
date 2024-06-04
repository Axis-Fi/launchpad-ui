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

  // TODO add SVG icons for links

  return (
    <Card
      className={props.className}
      title={`About ${auction.auctionInfo?.name || ""}`}
    >
      <div className="mb-4 flex">{description}</div>
      <div className="flex-start flex space-x-4">
        {website && (
          <Link className="text-primary flex" href={website}>
            WEBSITE
          </Link>
        )}
        {twitter && (
          <Link className="text-primary flex" href={twitter}>
            TWITTER
          </Link>
        )}
        {discord && (
          <Link className="text-primary flex" href={discord}>
            DISCORD
          </Link>
        )}
        {farcaster && (
          <Link className="text-primary flex" href={farcaster}>
            FARCASTER
          </Link>
        )}
      </div>
    </Card>
  );
}
