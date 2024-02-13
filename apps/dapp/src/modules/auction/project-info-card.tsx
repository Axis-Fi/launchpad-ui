import { Link } from "@repo/ui";
import { ArrowUpRightIcon } from "lucide-react";
import { PropsWithAuction } from ".";

export function ProjectInfoCard({
  auction,
  ...props
}: PropsWithAuction & React.HTMLAttributes<HTMLDivElement>) {
  const description =
    auction.auctionInfo?.description ??
    "No description found for this project.";

  return (
    <div className={props.className}>
      <div className="mb-2 flex justify-between">
        <h3>About {auction.baseToken.name}</h3>
        <Link className="text-primary flex items-end" href="">
          GO TO WEBSITE
          <ArrowUpRightIcon className="inline" />
        </Link>
      </div>
      {description}
    </div>
  );
}
