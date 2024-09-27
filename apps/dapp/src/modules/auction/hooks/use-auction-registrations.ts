import { LaunchRegistration } from "@repo/points";
import { useMutation, useQuery } from "@tanstack/react-query";
import { usePoints } from "context/points-provider";
import { useAccount } from "wagmi";

export function useAuctionRegistrations() {
  const { address } = useAccount();
  const { pointsClient } = usePoints();

  const activeRegistrations = useQuery({
    queryKey: ["demand"],
    queryFn: pointsClient.getActiveRegistrationLaunches,
  });

  const userRegistrations = useQuery({
    queryKey: ["user-registrations", address],
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

  return {
    activeRegistrations: activeRegistrations.data,
    userRegistrations: userRegistrations.data,

    registerDemand: registerDemandMutation.mutate,
    registerDemandMutation,

    updateDemand: updateDemandMutation.mutate,
    updateDemandMutation,

    cancelDemand: cancelDemandMutation.mutate,
    cancelDemandMutation,
  };
}
