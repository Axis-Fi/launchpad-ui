import { useNavigate } from "react-router-dom";
import { DataTable } from "components";
import { columns } from "./auction-list-columns";
import { useAuctions } from "loaders/useAuctions";
import {
  AuctionLotSnapshot,
  useAuctionsLatestSnapshot,
} from "loaders/useAuctionLatestSnapshot";

export function AuctionList() {
  const navigate = useNavigate();
  const { result: auctions } = useAuctions();
  const auctionSnapshotsResult = useAuctionsLatestSnapshot(
    auctions.map((auction) => auction.id),
  );
  const auctionSnapshots = auctionSnapshotsResult
    .map((snapshot) => snapshot.result)
    .filter((snapshot) => snapshot !== undefined) as AuctionLotSnapshot[];

  return (
    <div className="w-full py-10">
      <DataTable
        columns={columns}
        data={auctionSnapshots}
        onClickRow={(row) => {
          const auction = row.original;
          navigate(`/auction/${auction?.chainId}/${auction?.lot.lotId}`);
        }}
      />
    </div>
  );
}
