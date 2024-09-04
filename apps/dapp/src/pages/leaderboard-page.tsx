import { Card } from "@repo/ui";
import { PageContainer } from "modules/app/page-container";
import { Leaderboard } from "modules/points/leaderboard";
import { RecentJoins } from "modules/points/recent-joins";

export function LeaderboardPage() {
  return (
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
  );
}
