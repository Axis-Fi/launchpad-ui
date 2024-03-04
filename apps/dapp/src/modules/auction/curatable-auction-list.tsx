import { Button, DataTable, Tooltip, trimAddress } from "@repo/ui";
import { createColumnHelper } from "@tanstack/react-table";
import { useAuctions } from "modules/auction/hooks/use-auctions";
import type { AuctionListed } from "src/types";
import { useAccount } from "wagmi";
import { AuctionStatusChip } from "./auction-status-chip";
import { CheckIcon, XIcon } from "lucide-react";
import React from "react";
import { TransactionDialog } from "modules/transaction/transaction-dialog";
import { useCurateAuction } from "./hooks/use-curate-auction";

const col = createColumnHelper<AuctionListed>();
const cols = [
  col.accessor("owner", {
    header: "Creator",
    cell: (info) => trimAddress(info.getValue()),
  }),
  col.accessor("baseToken.symbol", {
    header: "Token",
  }),
  col.accessor("quoteToken.symbol", {
    header: "Raising",
  }),
  col.accessor("status", {
    header: "Status",
    cell: (info) => (
      <AuctionStatusChip className="w-1/2" status={info.getValue()} />
    ),
  }),
];

export function CuratableAuctionList() {
  const auctions = useAuctions();
  const { address } = useAccount();
  const data = auctions.result.filter(
    (a) => a.curator.toLocaleLowerCase() === address?.toLocaleLowerCase(),
  );
  const [curating, setCurating] = React.useState({ lotId: "", chainId: 0 });
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const curate = useCurateAuction(curating.lotId, curating.chainId);

  const columns = React.useMemo(
    () => [
      ...cols,
      col.display({
        header: "Curate",
        cell: (info) => {
          const approved = info.row.original.curatorApproved;
          const isApprovable = ["live", "created"].includes(
            info.row.original.status,
          );

          if (!approved && !isApprovable) {
            return <XIcon className="text-axis-red" />;
          }

          return (
            <CurateButton
              onClick={() => {
                setCurating({
                  lotId: info.row.original.lotId,
                  chainId: info.row.original.chainId,
                });
                setIsDialogOpen(true);
              }}
              approved={approved}
            />
          );
        },
      }),
    ],
    [auctions.result],
  );

  return (
    <>
      <DataTable columns={columns} data={data} />
      <TransactionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        chainId={curating.chainId}
        hash={curate.curateTx.data}
        mutation={curate.curateReceipt}
        onConfirm={curate.handleCurate}
      />
    </>
  );
}

function CurateButton(
  props: React.HTMLAttributes<HTMLButtonElement> & { approved?: boolean },
) {
  return !props.approved ? (
    <Button {...props}>Curate</Button>
  ) : (
    <Tooltip content="You've accepted curating this auction">
      <CheckIcon className="text-axis-green" />
    </Tooltip>
  );
}
