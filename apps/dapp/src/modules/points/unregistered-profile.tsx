import { useAccount } from "wagmi";
import { Link } from "react-router-dom";
import { Avatar, Button, Metric } from "@/components";
import { PageContainer } from "modules/app/page-container";
import { Format } from "modules/token/format";
import { BlockExplorerLink } from "components/blockexplorer-link";
import { PhaseTables } from "./phase-tables";

const mockUnregisteredProfile = {
  ref_points: 100,
  bid_points: 50,
  total_points: 150,
};

export function UnregisteredProfile() {
  const { address, chainId } = useAccount();
  const unregisteredProfile = mockUnregisteredProfile;

  return (
    <>
      <div className="axis-rainbow-reverse p-xl flex h-[224px] w-full items-center">
        <div className="m-md gap-md flex w-full">
          <div className="gap-md flex">
            <Avatar
              className="h-[160px] w-[160px] rounded-none"
              src="/images/default-user-avatar.png"
            />
            <div className="flex flex-col justify-between">
              <div className="flex flex-col">
                <BlockExplorerLink
                  chainId={chainId!}
                  address={address}
                  icon={true}
                  trim
                />
              </div>
              <Metric label="Total Points Earned" size="xl">
                <Format value={unregisteredProfile.total_points}></Format>
              </Metric>
            </div>
          </div>
          <div className="flex items-end">
            <Button variant="primary" asChild>
              <Link to="/points/register">Claim points</Link>
            </Button>
          </div>
        </div>
      </div>

      <PageContainer>
        <PhaseTables />
      </PageContainer>
    </>
  );
}
