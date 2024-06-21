import { PropsWithAuction } from "@repo/types";
import { Card, DataTable } from "@repo/ui";
import { CSVDownloader } from "components/csv-downloader";
import React from "react";
import { arrayToCSV } from "utils/csv";
import {
  amountInCol,
  bidListColumnHelper,
  bidderCol,
  timestampCol,
} from "./bid-list";
import { trimCurrency } from "utils/currency";

const amountOutCol = bidListColumnHelper.accessor("settledAmountOut", {
  header: "Amount Out",
  cell: (info) =>
    `${trimCurrency(info.getValue() ?? "")} ${
      info.row.original.auction.baseToken.symbol
    }`,
});
const columns = [timestampCol, amountInCol, amountOutCol, bidderCol];

export function PurchaseList({ auction }: PropsWithAuction) {
  const [headers, body] = React.useMemo(() => {
    const values = auction.bids.map((b) => ({
      date: b.date,
      amountIn: b.amountIn,
      settledAmountOut: b.settledAmountOut,
      bidder: b.bidder,
    }));

    return arrayToCSV(values ?? []);
  }, [auction]);

  const bids = auction.bids.map((b) => ({ ...b, auction }));

  return (
    <Card
      title={"Purchase History"}
      headerRightElement={
        <CSVDownloader
          tooltip="Download this bid history in CSV format."
          filename={`purchases-${auction.auctionType}-${auction.id}`}
          headers={headers}
          data={body}
        />
      }
    >
      <DataTable
        emptyText={
          auction.status == "created" || auction.status == "live"
            ? "No purchases yet"
            : "No purchases received"
        }
        columns={columns}
        data={bids}
      />
    </Card>
  );
}
