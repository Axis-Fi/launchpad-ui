import { Avatar, Badge, Button, Card, Metric, Text } from "@/components";
import { PageContainer } from "modules/app/page-container";
import { Format } from "modules/token/format";
import { PhaseTables } from "./phase-tables";
import { LinkedWalletsTable } from "./linked-wallets-table";
import { Link, useLocation } from "react-router-dom";
import { useProfile } from "./hooks/use-profile";

export function Profile() {
  const location = useLocation();
  const { profile } = useProfile();

  if (profile == null) return null;

  const totalPoints = profile.points?._0?.totalPoints;

  return (
    <>
      <div className="axis-rainbow-reverse p-xl flex h-[224px] w-full items-center">
        <div className="m-md mx-auto flex w-full max-w-[1400px] items-start justify-between">
          <div className="gap-md flex">
            <Avatar
              className="h-[160px] w-[160px] rounded-none"
              src={profile.profileImageUrl}
            />
            <div className="flex flex-col justify-between">
              <div className="flex flex-col">
                <div className="gap-sm flex">
                  <Text size="xl">{profile.username}</Text>
                  <Badge size="m">#{profile.rank}</Badge>
                </div>
              </div>
              <Metric label="Total Points Earned" size="xl">
                <Format value={totalPoints ?? 0}></Format>
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

        <Card>
          <LinkedWalletsTable />
          <div className="flex justify-center">
            {profile && (
              <Button
                variant="secondary"
                className="w-full md:w-[33%] lg:w-[20%]"
                asChild
              >
                <Link to="/points/link-wallet">Link wallet</Link>
              </Button>
            )}
            {!profile && (
              <Button variant="secondary">Claim points to link a wallet</Button>
            )}
          </div>
        </Card>
      </PageContainer>
    </>
  );
}
