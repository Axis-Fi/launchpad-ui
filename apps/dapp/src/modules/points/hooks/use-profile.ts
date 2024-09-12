import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { usePoints } from "context/points-provider";
import { useState } from "react";
import type { Address } from "@repo/types";

export const schema = z.object({
  username: z
    .string()
    .min(1, { message: "Username must be at least 1 characters" })
    .refine((value) => value.includes(" ") === false, {
      message: "Username must not contain any whitespace",
    }),
  referrer: z.string().optional(),
  avatar: z.instanceof(File).optional(),
});

export type ProfileForm = z.infer<typeof schema>;

export function useProfile() {
  const points = usePoints();
  const referrer = undefined; // TODO: referre for points progam != referer of a launch

  const register = useMutation({
    mutationFn: async (profile: ProfileForm) =>
      points.register(profile.username, referrer, profile.avatar),
  });

  const updateProfile = useMutation({
    mutationFn: async (profile: ProfileForm) =>
      points.setUserProfile(profile.username, profile.avatar),
  });

  const signIn = useMutation({
    mutationFn: async () => points.signIn(),
  });

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
    enabled: points.isUserSignedIn,
  });

  const [address, setAddress] = useState<Address | null>(null);

  const walletPointsQuery = useQuery({
    queryKey: ["walletPointsQuery", address],
    queryFn: () => points.getWalletPoints(address!),
    enabled: address != null,
  });

  return {
    profile: profileQuery.data,
    isUserRegistered: userRegisteredQuery.data,
    isUserSignedIn: points.isUserSignedIn,
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
  };
}
