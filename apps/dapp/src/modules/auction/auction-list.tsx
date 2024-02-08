import { useNavigate } from "react-router-dom";
import { DataTable } from "components";
import { columns } from "./auction-list-columns";
import { useAuctions } from "loaders/useAuctions";

export function AuctionList() {
  const navigate = useNavigate();
  const { result: auctions } = useAuctions();

  // TODO fetch latest snapshot for each auction

  // TODO show loading indicator

  return (
    <div className="w-full py-10">
      <DataTable
        columns={columns}
        data={auctions}
        onClickRow={(row) => {
          const auction = row.original;
          navigate(`/auction/${auction?.chainId}/${auction?.id}`);
        }}
      />
    </div>
  );
}
