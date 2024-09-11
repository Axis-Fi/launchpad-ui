import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { usePoints } from "context/points-provider";
import { useState } from "react";
import type { FullUserProfile } from "@repo/points";
import { zeroAddress } from "viem";

export const schema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" }),
  referrer: z.string().optional(),
  avatar: z.instanceof(File).optional(),
});

export const mockProfile = {
  rank: 420,
  username: "Tex",
  profileImageUrl: "/placeholder-img.jpg",
  referrer: `0x${"1".repeat(40)}`,
  points: {
    _0: {
      refPoints: 1000,
      bidPoints: 500,
      totalPoints: 1500,
    },
    _1: {
      refPoints: 1000,
      bidPoints: 500,
      totalPoints: 1500,
    },
    _2: {
      refPoints: 0,
      bidPoints: 0,
      totalPoints: 0,
    },
  },
  activities: {
    _1: [
      {
        platform: "Fjord",
        event: "RAGE",
        description: undefined,
        activityType: 0,
        contribution: 250,
        multiplier: 2,
        points: 500,
      },
      {
        platform: "Origin",
        event: "Jem",
        description: undefined,
        activityType: 1,
        contribution: 10000,
        multiplier: 0.1,
        points: 1000,
      },
    ],
  },
  wallets: [
    {
      address: zeroAddress,
      refPoints: 1000,
      bidPoints: 500,
      totalPoints: 1500,
    },
  ],
} satisfies FullUserProfile;

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

  const register = (profile: ProfileForm) => {
<<<<<<< HEAD
    try {
      schema.parse(profile);
      return registerMutation.mutate(profile);
    } catch (e) {
      if (e instanceof z.ZodError) {
        console.error("Validation failed: ", e.issues[0]);
      } else {
        console.error("Unexpected error: ", e);
      }
    }
=======
    return mutation.mutate(profile);
>>>>>>> ab70136 (add create profile step)
  };

  const updateProfile = (profile: ProfileForm) => {
    try {
      schema.parse(profile);
      return updateProfileMutation.mutate(profile);
    } catch (e) {
      if (e instanceof z.ZodError) {
        console.error("Validation failed: ", e.issues[0]);
      } else {
        console.error("Unexpected error: ", e);
      }
    }
  };

  const signIn = () => {
    try {
      return signInMutation.mutate();
    } catch (e) {
      console.error("Unexpected error: ", e);
    }
  };

  const [username, setUsername] = useState<string | null>(null);

  const usernameQuery = useQuery({
    queryKey: ["usernameQuery", username],
    queryFn: () => points.isUsernameAvailable(username!),
    enabled: schema.safeParse(username).success,
  });

  const userRegisteredQuery = useQuery({
    queryKey: ["userRegisteredQuery"],
    queryFn: points.isUserRegistered,
  });

  // TODO: uncomment when points server is fixed
  // const profileQuery = useQuery({
  //   queryKey: ["profileQuery"],
  //   queryFn: points.getUserProfile,
  // });

  return {
    profile: mockProfile,
    // profile: profileQuery.data,
    isUserRegistered: userRegisteredQuery.data,
    isUserSignedIn: points.isUserSignedIn,
    isUsernameAvailable: {
      result: usernameQuery,
      check: setUsername,
    },
    register,
    updateProfile,
    signIn,
  };
}
