import { useAccount } from "wagmi";
import {
  Avatar,
  Badge,
  Button,
  Card,
  DataTable,
  Metric,
  Text,
} from "@/components";
import { PageContainer } from "modules/app/page-container";
import { Format } from "modules/token/format";
import { BlockExplorerLink } from "components/blockexplorer-link";

const mockProfile = {
  rank: 420,
  username: "Tex",
  avatar: "/placeholder-img.jpg",
  points: {
    total: 28500,
    phase_1: {
      referral: 18000,
      bidding: 9000,
      total: 27000,
    },
    phase_2: {
      referral: 1000,
      bidding: 500,
      total: 1500,
    },
  },
  activity: {
    phase_1: [
      {
        platform: "Coinlist",
        type: "bid",
        token: "PIZZA",
        points: 100,
      },
      {
        platform: "Fjord",
        type: "bid",
        token: "RAGE",
        points: 50,
      },
      {
        platform: "Origin",
        type: "refer",
        token: null,
        points: 50,
      },
    ],
    phase_2: [
      {
        platform: "Origin",
        type: "bid",
        token: "AU",
        action: "bid",
        points: 2000,
      },
      {
        platform: "Origin",
        type: "refer",
        token: null,
        points: 500,
      },
    ],
  },
  linked_wallets: ["0x123", "0x456"],
  linked_wallets_points: {
    "0x123": {
      referrals: 100,
      bidding: 500,
      total: 600,
    },
    "0x456": {
      referrals: 0,
      bidding: 10,
      total: 10,
    },
  },
};

export function Profile() {
  const { address, chainId } = useAccount();
  const profile = mockProfile;
  return (
    <>
      <div className="axis-rainbow-reverse p-xl flex h-[224px] w-full items-center">
        <div className="m-md flex w-full items-start justify-between">
          <div className="gap-md flex">
            <Avatar
              className="h-[160px] w-[160px] rounded-none"
              src="/placeholder-img.jpg"
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
            <Button variant="secondary">Edit profile</Button>
            <Button variant="primary">Share ref link</Button>
          </div>
        </div>
      </div>

      <PageContainer>
        <Card>
          <DataTable
            title="Linked Wallets (private)"
            subtitle="Link more wallets and get more points"
            data={profile.linked_wallets}
            columns={[
              {
                header: "Wallet Address",
              },
              {
                header: "Bidding points",
              },
              {
                header: "Referral points",
              },
              {
                header: "Total",
              },
            ]}
          />
        </Card>
        <Card>
          <DataTable
            title="Phase 1 points"
            subtitle="Refer friends to earn more points"
            data={profile.linked_wallets}
            columns={[
              {
                header: "Activity",
              },
              {
                header: "Points",
              },
            ]}
          />
        </Card>
      </PageContainer>
    </>
  );
}
