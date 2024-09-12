import { useQuery } from "@tanstack/react-query";
import { usePoints } from "context/points-provider";

export function useLeaderboard() {
  const points = usePoints();

  const leaderboardQuery = useQuery({
    queryKey: ["leaderboardQuery"],
    queryFn: points.getLeaderboard,
  });

  return leaderboardQuery.data;
}
