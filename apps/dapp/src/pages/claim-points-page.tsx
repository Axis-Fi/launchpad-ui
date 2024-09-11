import { metadata } from "@repo/env";
import { Text } from "@repo/ui";
import { SocialRow } from "components/social-row";
import { ArrowLeftIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { ClaimPointsWizard } from "modules/points/claim-points-wizard";

export function ClaimPointsPage() {
  return (
    <div className="claim-points-gradient absolute inset-0 z-20 flex h-dvh w-dvw flex-col">
      <div className="flex justify-center py-10">
        <img src="images/axis-wordmark.svg" width={99} height={32} />
        <Link
          to="/points"
          className="hover:text-surface absolute right-20 flex items-center gap-x-1"
        >
          <ArrowLeftIcon className="duration-150" />
          <Text uppercase mono className="duration-150">
            Back to Leaderboard
          </Text>
        </Link>
      </div>

      <div className="flex h-5/6 items-center justify-center border">
        <ClaimPointsWizard />
      </div>
      <div className="flex justify-center pb-[64px] pt-10">
        <SocialRow className="gap-x-8" iconClassName="size-8" {...metadata} />
      </div>
    </div>
  );
}
