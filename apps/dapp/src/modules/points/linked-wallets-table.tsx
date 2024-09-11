import { Button, Card, DataTable } from "@/components";
import type { FullUserProfile } from "@repo/points";
import { BlockExplorerLink } from "components/blockexplorer-link";
import { Format } from "modules/token/format";
import { useAccount } from "wagmi";

type LinkedWalletsTableProps = {
  profile?: FullUserProfile;
};

export function LinkedWalletsTable({ profile }: LinkedWalletsTableProps) {
  const { chainId } = useAccount();

  return (
    <Card>
      <DataTable
        title="Linked Wallets"
        subtitle="Link more wallets and get more points. Linked wallets are only visible to you."
        data={profile?.wallets ?? []}
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
            accessorKey: "bidPoints",
            cell: ({ row }) => <Format value={row.original.bidPoints ?? 0} />,
          },
          {
            header: "Referral points",
            accessorKey: "refPoints",
            cell: ({ row }) => <Format value={row.original.refPoints ?? 0} />,
          },
          {
            header: "Total",
            accessorKey: "totalPoints",
            cell: ({ row }) => <Format value={row.original.totalPoints ?? 0} />,
          },
        ]}
      />
      <div className="flex justify-center">
        {profile && (
          <Button variant="secondary" className="w-full md:w-[33%] lg:w-[20%]">
            Link wallets
          </Button>
        )}
        {!profile && (
          <Button variant="secondary">Claim points to link a wallet</Button>
        )}
      </div>
    </Card>
  );
}
