import { Avatar, Badge, Button, Card, Metric, Text } from "@/components";
import { PageContainer } from "modules/app/page-container";
import { Format } from "modules/token/format";
import { PhaseTables } from "./phase-tables";
import { LinkedWalletsTable } from "./linked-wallets-table";
import { Link, useLocation } from "react-router-dom";
import { useProfile } from "./hooks/use-profile";
import { LinkMoreWalletsBanner } from "./linke-more-wallets-banner";
import { useMediaQueries } from "loaders/use-media-queries";

export function Profile() {
  const location = useLocation();
  const { profile } = useProfile();
  const { isTabletOrMobile } = useMediaQueries();

  if (profile == null) return null;

  const totalPoints = profile.points?._0?.totalPoints;

  return (
    <>
      <div className="axis-rainbow-reverse p-xl flex h-[224px] w-full items-center">
        <div className="m-md mx-auto flex w-full max-w-[1400px] flex-col items-center lg:flex-row lg:items-start lg:justify-between">
          <div className="gap-md flex items-center">
            <Avatar
              className="size-[80px] rounded-none lg:size-[160px]"
              src={profile.profileImageUrl}
            />
            <div className="-mt-2 flex flex-col justify-between lg:mt-0">
              <div className="flex flex-col">
                <div className="gap-sm flex">
                  <Text size="xl" className="">
                    {profile.username}
                  </Text>
                  <Badge size="m">#{profile.rank}</Badge>
                </div>
              </div>
              <Metric
                label="Total Points Earned"
                size={isTabletOrMobile ? "m" : "xl"}
              >
                <Format value={totalPoints ?? 0}></Format>
              </Metric>
            </div>
          </div>
          <div className="gap-md mt-8 flex lg:mt-0 lg:flex-row">
            <Button
              variant="secondary"
              asChild
              size={isTabletOrMobile ? "sm" : "md"}
            >
              <Link to={`${location.pathname}/edit`}>Edit profile</Link>
            </Button>
            <Button
              variant="primary"
              asChild
              size={isTabletOrMobile ? "sm" : "md"}
            >
              <Link to={`${location.pathname}/refer`}>Share ref link</Link>
            </Button>
          </div>
        </div>
      </div>

      <PageContainer>
        <LinkMoreWalletsBanner />
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
