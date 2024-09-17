import { useQuery } from "@tanstack/react-query";
import { usePoints } from "context/points-provider";

export function useLeaderboard() {
  const points = usePoints();

  const leaderboardQuery = useQuery({
    queryKey: ["leaderboardQuery"],
    queryFn: points.getLeaderboard,
  });

  const recentJoinsQuery = useQuery({
    queryKey: ["recentJoinsQuery"],
    queryFn: points.getRecentJoins,
  });

  return {
    leaderboard: leaderboardQuery.data,
    recentJoins: recentJoinsQuery.data,
  };
}
