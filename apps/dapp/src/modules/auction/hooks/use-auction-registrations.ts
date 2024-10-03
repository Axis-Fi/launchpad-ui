import { useCallback } from "react";
import { useAccount } from "wagmi";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { LaunchRegistration } from "@repo/points";
import { usePoints } from "context/points-provider";
import { mapRegistrationToAuction } from "../utils/map-registration-to-auction";

export function useAuctionRegistrations() {
  const { address } = useAccount();
  const { pointsClient } = usePoints();

  const activeRegistrations = useQuery({
    queryKey: ["registration-launches"],
    queryFn: () => pointsClient.getActiveRegistrationLaunches(),
    select: mapRegistrationToAuction,
  });

  const userRegistrations = useQuery({
    queryKey: ["user-launch-registrations", address],
    queryFn: pointsClient.getUserRegistrations,
  });

  const registerDemandMutation = useMutation({
    mutationFn: (registration: LaunchRegistration) =>
      pointsClient.registerUserDemand(registration),
  });

  const updateDemandMutation = useMutation({
    mutationFn: (registration: LaunchRegistration) =>
      pointsClient.updateUserDemand(registration),
  });

  const cancelDemandMutation = useMutation({
    mutationFn: (registration: LaunchRegistration) =>
      pointsClient.cancelUserDemand(registration),
  });

  const getRegistrationLaunch = useCallback(
    (lotId?: string, chainId?: number) => {
      if (lotId == null || chainId == null) return undefined;

      return activeRegistrations.data?.find(
        (r) => r?.lotId === lotId && r?.chainId === chainId,
      );
    },
    [activeRegistrations.data],
  );

  return {
    activeRegistrations,
    userRegistrations,

    registerDemand: registerDemandMutation.mutate,
    registerDemandMutation,

    updateDemand: updateDemandMutation.mutate,
    updateDemandMutation,

    cancelDemand: cancelDemandMutation.mutate,
    cancelDemandMutation,

    getRegistrationLaunch,
  };
}
