import { Button, DataTable, Tooltip, trimAddress } from "@repo/ui";
import { Link } from "react-router-dom";
import { createColumnHelper } from "@tanstack/react-table";
import { useAuctions } from "modules/auction/hooks/use-auctions";
import { AuctionType, type AuctionListed } from "@repo/types";
import { useAccount } from "wagmi";
import { AuctionStatusBadge } from "./auction-status-badge";
import { CheckIcon, XIcon } from "lucide-react";
import React from "react";
import { TransactionDialog } from "modules/transaction/transaction-dialog";
import { useCurateAuction } from "./hooks/use-curate-auction";
import { ChainIcon } from "components/chain-icon";
import { getAuctionPath } from "utils/router";

const col = createColumnHelper<AuctionListed>();
const cols = [
  col.accessor("chainId", {
    header: "Chain",
    cell: (info) => <ChainIcon chainId={info.getValue()} />,
  }),
  col.accessor("seller", {
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
      <AuctionStatusBadge className="w-[80%]" status={info.getValue()} />
    ),
  }),
];

export function CuratableAuctionList() {
  const auctions = useAuctions();
  const { address } = useAccount();
  const data = auctions.data.filter(
    (a) => a.curator?.toLocaleLowerCase() === address?.toLocaleLowerCase(),
  );
  const [curating, setCurating] = React.useState({
    lotId: "",
    chainId: 0,
    auctionType: AuctionType.SEALED_BID,
  });

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const curate = useCurateAuction(
    curating.lotId,
    curating.chainId,
    curating.auctionType,
  );

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

          if (!approved || !isApprovable) {
            return <XIcon className="text-axis-red" />;
          }

          return (
            <CurateButton
              onClick={() => {
                setCurating({
                  lotId: info.row.original.lotId,
                  chainId: info.row.original.chainId,
                  auctionType: info.row.original.auctionType,
                });
                setIsDialogOpen(true);
              }}
              approved={approved}
            />
          );
        },
      }),
      col.display({
        id: "view",
        cell: (info) => (
          <Link to={"/" + getAuctionPath(info.row.original)}>
            <Button size="sm">View</Button>
          </Link>
        ),
      }),
    ],
    [auctions.data],
  );

  return (
    <>
      <DataTable
        //@ts-expect-error TODO: debug -> Adding chain column introduced a compile error fsr
        columns={columns}
        data={data}
      />
      <TransactionDialog
        signatureMutation={curate.curateTx}
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
    <Button size="sm" {...props}>
      Curate
    </Button>
  ) : (
    <Tooltip content="You've accepted curating this auction">
      <CheckIcon className="text-axis-green" />
    </Tooltip>
  );
}
