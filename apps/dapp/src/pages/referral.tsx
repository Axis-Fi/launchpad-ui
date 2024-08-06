import { Card, Text } from "@repo/ui";
import { ReferralLinkCard } from "modules/referral/referral-link-card";
import { PageContainer } from "modules/app/page-container";
import { ReferralLeaderboard } from "modules/referral/referral-leaderboard";

export function ReferralPage() {
  return (
    <PageContainer title="Referral Links" className="max-w-limit">
      <div className="flex gap-x-2">
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
