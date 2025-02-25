import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { axisTwitterFollowing } from "modules/app/ipfs-api";

const useAxisFollowing = (
  enabled: boolean = true,
): UseQueryResult<string[]> => {
  return useQuery({
    queryKey: ["twitter-following-ids"],
    queryFn: axisTwitterFollowing,
    staleTime: 1000 * 60 * 5, // 5 mins
    enabled,
  });
};

export { useAxisFollowing };
