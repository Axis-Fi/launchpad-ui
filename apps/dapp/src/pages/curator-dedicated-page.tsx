import { allowedCurators } from "@repo/env";
import { useParams } from "react-router-dom";
import AuctionListPage from "./auction-list-page";

export function CuratorDedicatedPage() {
  const params = useParams();
  const curator = allowedCurators.find((c) => c.id === params.curatorId);
  console.log({ curator, params });

  if (!curator) {
    throw new Error("Curator not found");
  }

  return <AuctionListPage curator={curator} />;
}
