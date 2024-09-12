import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { usePoints } from "context/points-provider";
import { useState } from "react";
import type { Address } from "@repo/types";

const usernameSchema = z
  .string()
  .min(1, { message: "Username must be at least 1 characters" });

export const schema = z.object({
  username: usernameSchema,
  referrer: z.string().optional(),
  avatar: z.instanceof(File).optional(),
});

export type ProfileForm = z.infer<typeof schema>;

export function useProfile() {
  const points = usePoints();
  const referrer = undefined; // TODO: referre for points progam != referer of a launch

  const registerMutation = useMutation({
    mutationFn: async (profile: ProfileForm) =>
      points.register(profile.username, referrer, profile.avatar),
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (profile: ProfileForm) =>
      points.setUserProfile(profile.username, profile.avatar),
  });

  const signInMutation = useMutation({
    mutationFn: async () => points.signIn(),
  });

  const register = (profile: ProfileForm, onSuccess?: () => void) => {
    try {
      schema.parse(profile);
      return registerMutation.mutate(profile, { onSuccess });
    } catch (e) {
      if (e instanceof z.ZodError) {
        console.error("Validation failed: ", e.issues[0]);
      } else {
        console.error("Unexpected error: ", e);
      }
    }
  };

  const updateProfile = (profile: ProfileForm, onSuccess?: () => void) => {
    try {
      schema.parse(profile);
      return updateProfileMutation.mutate(profile, { onSuccess });
    } catch (e) {
      if (e instanceof z.ZodError) {
        console.error("Validation failed: ", e.issues[0]);
      } else {
        console.error("Unexpected error: ", e);
      }
    }
  };

  const signIn = (onSuccess?: () => void) => {
    try {
      return signInMutation.mutate(undefined, { onSuccess });
    } catch (e) {
      console.error("Unexpected error: ", e);
    }
  };

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
