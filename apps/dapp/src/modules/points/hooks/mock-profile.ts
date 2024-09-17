import { zeroAddress } from "viem";
import type { FullUserProfile } from "@repo/points";

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
        activityType: "bid",
        contribution: 250,
        multiplier: 2,
        points: 500,
      },
      {
        platform: "Origin",
        event: "Jem",
        description: undefined,
        activityType: "refer",
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
