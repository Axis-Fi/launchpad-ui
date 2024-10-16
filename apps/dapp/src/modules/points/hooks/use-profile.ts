import { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { useAccount } from "wagmi";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { Address } from "@repo/types";
import { usePoints } from "context/points-provider";
import { useReferrer } from "state/referral";
import { useNavigate } from "react-router-dom";
import analytics from "modules/app/analytics";

export const schema = z.object({
  username: z
    .string()
    .min(1, { message: "Username must be at least 1 characters" })
    .max(25, { message: "Username must be less than 26 characters" })
    .refine((value) => /^[a-zA-Z0-9_-]+$/.test(value), {
      message: "Username must contain alphanumeric, _ or, - characters only",
    })
    .refine((value) => value.includes(" ") === false, {
      message: "Username must not contain any whitespace",
    }),
  referrer: z.string().optional(),
  avatar: z.instanceof(File).optional(),
});

export type ProfileForm = z.infer<typeof schema>;

export function useProfile() {
  const points = usePoints();
  const navigate = useNavigate();

  const { address: connectedAddress } = useAccount();

  const referrer = useReferrer();

  const register = useMutation({
    mutationFn: async ({
      profile,
      statement,
    }: {
      profile: ProfileForm;
      statement?: string;
    }) => {
      analytics.trackEvent("register", {
        props: { address: connectedAddress as string },
      });

      return points.register(
        profile.username,
        referrer,
        profile.avatar,
        statement,
      );
    },
    onSuccess: () => profileQuery.refetch(),
  });

  const updateProfile = useMutation({
    mutationFn: async (profile: ProfileForm) =>
      points.setUserProfile(profile.username, profile.avatar),
    onSuccess: () => profileQuery.refetch(),
  });

  const linkWallet = useMutation({
    mutationFn: async () => points.linkWallet(),
    onSuccess: () => profileQuery.refetch(),
  });

  const signIn = useMutation({
    mutationFn: async (statement?: string) => points.signIn(statement),
  });

  const signOut = useCallback(() => {
    points.signOut();
    navigate("/");
  }, [points, navigate]);

  const [username, setUsername] = useState<string | null>(null);

  const usernameQuery = useQuery({
    queryKey: ["usernameQuery", username],
    queryFn: () => points.isUsernameAvailable(username!),
    enabled: username != null,
  });

  const userRegisteredQuery = useQuery({
    queryKey: ["userRegisteredQuery"],
    queryFn: points.isUserRegistered,
  });

  const profileQuery = useQuery({
    queryKey: ["profileQuery"],
    queryFn: points.getUserProfile,
    enabled: points.isUserSignedIn(),
  });

  const [address, setAddress] = useState<Address | null>(null);

  const walletPointsQuery = useQuery({
    queryKey: ["walletPointsQuery", address],
    queryFn: () => points.getWalletPoints(address!),
    enabled: address != null,
  });

  const isConnectedWalletRegisteredQuery = useQuery({
    queryKey: ["isConnectedWalletRegistered", connectedAddress],
    queryFn: () => points.isWalletRegistered(connectedAddress!),
    enabled: connectedAddress != null,
  });

  // which is linked to a different user profile
  useEffect(() => {
    async function autoSignOut() {
      if (connectedAddress == null || profileQuery.data?.wallets == null) {
        return;
      }

      const userHasLinkedConnectedWallet = profileQuery.data.wallets.some(
        (wallet) =>
          wallet.address?.toLowerCase() === connectedAddress?.toLowerCase(),
      );

      const isConnectedWalletRegistered = isConnectedWalletRegisteredQuery.data;

      if (isConnectedWalletRegistered && !userHasLinkedConnectedWallet) {
        signOut();
      }
    }
    autoSignOut();
  }, [
    signOut,
    connectedAddress,
    isConnectedWalletRegisteredQuery.data,
    points,
    profileQuery.data,
  ]);

  // When a user connects a new wallet, refetch
  // the isRegistered query if there's not already one in-flight
  useEffect(() => {
    if (connectedAddress == null) return;
    userRegisteredQuery.refetch({ cancelRefetch: false });
  }, [connectedAddress, userRegisteredQuery]);

  return {
    profile: profileQuery.data,
    isUserRegistered: userRegisteredQuery,
    isUserSignedIn: points.isUserSignedIn(),
    usernameCheck: {
      ...usernameQuery,
      fetch: setUsername,
    },
    walletPoints: {
      ...walletPointsQuery,
      fetch: setAddress,
    },
    register,
    updateProfile,
    signIn,
    signOut,
    linkWallet,
  };
}
