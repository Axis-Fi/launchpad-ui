import { useNavigate } from "react-router-dom";
import { DataTable } from "components";
//import useAuctions from "loaders/use-auctions";
import { columns } from "./auction-list-columns";
import { mockAuctions } from "loaders/mock-data";

export function AuctionList() {
  const navigate = useNavigate();
  //const { data, isLoading } = useAuctions();

  return (
    <div className="w-full py-10">
      <DataTable
        columns={columns}
        data={mockAuctions}
        onClickRow={(row) => {
          const auction = row.original;
          navigate(`/auction/${auction?.chainId}/${auction?.id}`);
        }}
      />
    </div>
  );
}
