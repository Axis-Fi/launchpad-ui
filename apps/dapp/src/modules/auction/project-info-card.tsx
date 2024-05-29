import { Card, Link, Text } from "@repo/ui";
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
    <Card className={props.className}>
      <div className="mb-2 flex justify-between">
        <Text size="3xl" weight="light">
          About {auction.auctionInfo?.name}
        </Text>

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
