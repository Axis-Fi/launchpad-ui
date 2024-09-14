import { useAccount } from "wagmi";
import { DataTable } from "@/components";
import { BlockExplorerLink } from "components/blockexplorer-link";
import { Format } from "modules/token/format";
import { useProfile } from "./hooks/use-profile";
import { useMemo } from "react";
import type { WalletPoints } from "@repo/points";
import type { ColumnDef } from "@tanstack/react-table";

const enforcedColumns = ["address"];

type LinkedWalletsTableProps = {
  visibleColumns?: Array<
    keyof Pick<WalletPoints, "bidPoints" | "refPoints" | "totalPoints">
  >;
  trimWalletAddress?: boolean;
  showSubtitle?: boolean;
};

export function LinkedWalletsTable({
  visibleColumns = ["bidPoints", "refPoints", "totalPoints"],
  trimWalletAddress = true,
  showSubtitle = true,
}: LinkedWalletsTableProps) {
  const { profile } = useProfile();
  const { chainId } = useAccount();
  const columns = useMemo(() => {
    return (
      [
        {
          header: "Wallet Address",
          accessorKey: "address",
          cell: ({ row }) => (
            <BlockExplorerLink
              chainId={chainId!}
              address={row.original.address}
              icon={true}
              trim={trimWalletAddress}
            />
          ),
        },
        {
          header: "Bid points",
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
      ] satisfies ColumnDef<WalletPoints>[]
    ).filter((column) =>
      [...enforcedColumns, ...visibleColumns].includes(
        column.accessorKey as keyof LinkedWalletsTableProps["visibleColumns"],
      ),
    );
  }, [chainId, trimWalletAddress, visibleColumns]);

  return (
    <DataTable
      title="Linked Wallets"
      subtitle={showSubtitle ? "Link more wallets to earn more points" : null}
      data={profile?.wallets ?? []}
      emptyText="No linked wallets"
      columns={columns}
    />
  );
}
