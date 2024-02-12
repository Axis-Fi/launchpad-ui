import { Link } from "@repo/ui";
import { Auction } from "src/types";
import { ArrowUpRightIcon } from "lucide-react";

export function ProjectInfoCard({
  auction,
  ...props
}: { auction: Auction } & React.HTMLAttributes<HTMLDivElement>) {
  const description =
    auction.description ?? "No description found for this project.";

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
