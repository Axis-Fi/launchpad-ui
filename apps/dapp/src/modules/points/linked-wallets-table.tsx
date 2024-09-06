import { Button, Card, DataTable } from "@/components";
import { BlockExplorerLink } from "components/blockexplorer-link";
import type { UserProfile } from "./profile";
import { useAccount } from "wagmi";

type LinkedWalletsTableProps = {
  profile: UserProfile;
};

export function LinkedWalletsTable({ profile }: LinkedWalletsTableProps) {
  const { chainId } = useAccount();

  return (
    <Card>
      <DataTable
        title="Linked Wallets"
        subtitle="Link more wallets and get more points"
        data={profile.linked_wallets}
        emptyText="No linked wallets"
        columns={[
          {
            header: "Wallet Address",
            accessorKey: "address",
            cell: ({ row }) => (
              <BlockExplorerLink
                chainId={chainId!}
                address={row.original.address}
                icon={true}
                trim
              />
            ),
          },
          {
            header: "Bidding points",
            accessorKey: "bidding",
          },
          {
            header: "Referral points",
            accessorKey: "referrals",
          },
          {
            header: "Total",
            accessorKey: "total",
          },
        ]}
      />
      <div className="flex justify-center">
        <Button variant="secondary" className="w-full md:w-[33%] lg:w-[20%]">
          Link wallets
        </Button>
      </div>
    </Card>
  );
}
