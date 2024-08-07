import { Card, Text } from "@repo/ui";
import { ReferralLinkCard } from "modules/referral/referral-link-card";
import { PageContainer } from "modules/app/page-container";
import { ReferralLeaderboard } from "modules/referral/referral-leaderboard";

export function ReferralPage() {
  return (
    <PageContainer title="Referral Links" containerClassName="items-center">
      <div className="max-w-[1100px] space-y-4 lg:w-[1100px]">
        <ReferralLinkCard />
        <Card className="relative w-full" title="Leaderboard">
          <Text className="absolute left-[180px] top-2" size="xs" mono>
            Coming Soon™
          </Text>
          <ReferralLeaderboard />
        </Card>
      </div>
    </PageContainer>
  );
}

export function ReferralLinkInput() {}
