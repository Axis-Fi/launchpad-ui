import { Link } from "react-router-dom";
import { Button, Card, Text } from "@repo/ui";
import { PageContainer } from "modules/app/page-container";
import { ClaimYourPointsBanner } from "modules/points/claim-your-points-banner";
import { Leaderboard } from "modules/points/leaderboard";
import { RecentJoins } from "modules/points/recent-joins";

export function LeaderboardPage() {
  return (
    <>
      <div className="axis-rainbow-reverse p-xl gap-sm flex h-[296px] w-full flex-col items-center justify-end">
        <Text size="2xl">Axis points</Text>
        <Button variant="secondary" asChild>
          <Link to="#">Find out if you&apos;re eligible</Link>
        </Button>
      </div>

      <PageContainer>
        <ClaimYourPointsBanner />

        <div className="flex flex-row gap-x-4">
          <Card className="w-3/4">
            <Leaderboard />
          </Card>
          <Card className="w-1/4">
            <RecentJoins />
          </Card>
        </div>
      </PageContainer>
    </>
  );
}
