import { Card, Text } from "@repo/ui";
import { PageContainer } from "modules/app/page-container";
import { Leaderboard } from "modules/points/leaderboard";
import { RecentJoins } from "modules/points/recent-joins";

export function LeaderboardPage() {
  return (
    <>
      <div className="axis-rainbow-reverse p-xl flex h-[224px] w-full flex-col items-center justify-end">
        <Text size="2xl">Axis points</Text>
      </div>

      <PageContainer>
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
