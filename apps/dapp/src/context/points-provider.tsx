import { createContext, useContext, useEffect } from "react";
import { useState } from "react";
import { useConfig } from "wagmi";
import { createPointsClient } from "@repo/points";
import type { UserProfile } from "modules/points/profile";

type PointsContextState = {
  leaderboard: UserProfile[];
  isLoading: boolean;
};

const initialState = {} as PointsContextState;
export const PointsContext = createContext<PointsContextState>(initialState);

export const usePoints = () => {
  return useContext(PointsContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const config = useConfig();
  const pointsClient = createPointsClient(config);
  const [leaderboard, setLeaderboard] = useState<UserProfile[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function getLeaderboard() {
      try {
        setIsLoading(true);
        const _leaderboard = await pointsClient.getLeaderboard();

        setLeaderboard(_leaderboard);
      } catch (e) {
        console.error(e);
      }
    }
    getLeaderboard();
  }, [pointsClient]);

  return (
    <PointsContext.Provider
      value={{
        leaderboard,
        isLoading,
      }}
    >
      {children}
    </PointsContext.Provider>
  );
};
