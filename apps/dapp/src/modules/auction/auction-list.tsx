import { useNavigate } from "react-router-dom";
import { DataTable } from "components";
import useAuctions from "loaders/use-auctions";
import { columns } from "./auction-list-columns";

export function AuctionList() {
  const navigate = useNavigate();
  const { data } = useAuctions();

  return (
    <div className="w-full py-10">
      <DataTable
        columns={columns}
        data={data}
        onClickRow={(row) => {
          const auction = row.original;
          navigate(`/auction/${auction.chainId}/${auction.id}`);
        }}
      />
    </div>
  );
}
