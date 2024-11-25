import { allowedCurators } from "@repo/env";
import { useLocation, useParams } from "react-router-dom";

export function useCuratorPage() {
  const params = useParams();
  const location = useLocation();
  const isCuratorPage = location.pathname.includes("/launches");
  const curator = allowedCurators.find((c) => c.id === params.curatorId);

  return {
    isCuratorPage,
    curator,
  };
}
