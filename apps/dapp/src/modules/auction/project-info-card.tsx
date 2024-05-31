import { Card, Link } from "@repo/ui";
import { ArrowUpRightIcon } from "lucide-react";
import { PropsWithAuction } from "@repo/types";

export function ProjectInfoCard({
  auction,
  ...props
}: PropsWithAuction & React.HTMLAttributes<HTMLDivElement>) {
  const description =
    auction.auctionInfo?.description ??
    "No description found for this project.";

  const website = auction.auctionInfo?.links?.website;

  return (
    <Card
      className={props.className}
      title={`About ${auction.auctionInfo?.name || ""}`}
    >
      <div className="flex justify-between">
        {website && (
          <Link className="text-primary flex items-end" href={website}>
            GO TO WEBSITE
            <ArrowUpRightIcon className="inline" />
          </Link>
        )}
      </div>
      {description}
    </Card>
  );
}
