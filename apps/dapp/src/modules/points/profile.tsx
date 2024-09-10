import { useAccount } from "wagmi";
import { Avatar, Badge, Button, Metric, Text } from "@/components";
import { PageContainer } from "modules/app/page-container";
import { Format } from "modules/token/format";
import { BlockExplorerLink } from "components/blockexplorer-link";
import { PhaseTables } from "./phase-tables";
import { LinkedWalletsTable } from "./linked-wallets-table";
import { Link, useLocation } from "react-router-dom";

export type Activity = {
  platform: string;
  type: "bid" | "refer";
  target: string | null;
  contribution: number;
  multiplier: number;
  points: number;
};

type Phase = {
  referral: number;
  bidding: number;
  total: number;
  activity: Activity[];
};

type LinkedWallet = {
  address: string;
  referrals: number;
  bidding: number;
  total: number;
};

export type UserProfile = {
  rank: number;
  username: string;
  avatar: string;
  points: {
    total: number;
    phase_1: Phase;
    phase_2: Phase;
  };
  linked_wallets: LinkedWallet[];
};

const mockProfile = {
  rank: 420,
  username: "Tex",
  avatar: "placeholder-img.jpg", // "/images/default-user-avatar.png",
  points: {
    total: 28500,
    phase_1: {
      referral: 18000,
      bidding: 9000,
      total: 27000,
      activity: [
        {
          platform: "Coinlist",
          type: "bid",
          contribution: 100,
          multiplier: 1,
          target: "PIZZA",
          points: 100,
        },
        {
          platform: "Fjord",
          type: "bid",
          contribution: 100,
          multiplier: 1,
          target: "RAGE",
          points: 50,
        },
        {
          platform: "Origin",
          type: "refer",
          contribution: 100,
          multiplier: 0.1,
          target: "Jem",
          points: 50,
        },
      ],
    },
    phase_2: {
      referral: 1000,
      bidding: 500,
      total: 1500,
      activity: [
        {
          platform: "Origin",
          type: "bid",
          target: "AU",
          contribution: 100,
          multiplier: 1,
          points: 2000,
        },
        {
          platform: "Origin",
          type: "refer",
          target: "0xdef",
          contribution: 100,
          multiplier: 0.1,
          points: 500,
        },
      ],
    },
  },
  linked_wallets: [
    {
      address: "0x123",
      referrals: 100,
      bidding: 500,
      total: 600,
    },
    {
      address: "0x456",
      referrals: 0,
      bidding: 10,
      total: 10,
    },
  ],
} satisfies UserProfile;

export function Profile() {
  const location = useLocation();
  const { address, chainId } = useAccount();
  const profile = mockProfile;

  return (
    <>
      <div className="axis-rainbow-reverse p-xl flex h-[224px] w-full items-center">
        <div className="m-md flex w-full items-start justify-between">
          <div className="gap-md flex">
            <Avatar
              className="h-[160px] w-[160px] rounded-none"
              src={profile.avatar}
            />
            <div className="flex flex-col justify-between">
              <div className="flex flex-col">
                <div className="gap-sm flex">
                  <Text size="xl">{profile.username}</Text>
                  <Badge size="m">#{profile.rank}</Badge>
                </div>
                <BlockExplorerLink
                  chainId={chainId!}
                  address={address}
                  icon={true}
                  trim
                />
              </div>
              <Metric label="Total Points Earned" size="xl">
                <Format value={profile.points.total}></Format>
              </Metric>
            </div>
          </div>
          <div className="gap-md flex flex-row">
            <Button variant="secondary" asChild>
              <Link to={`${location.pathname}/edit`}>Edit profile</Link>
            </Button>
            <Button variant="primary">Share ref link</Button>
          </div>
        </div>
      </div>

      <PageContainer>
        <PhaseTables profile={profile} />
        <LinkedWalletsTable profile={profile} />
      </PageContainer>
    </>
  );
}
