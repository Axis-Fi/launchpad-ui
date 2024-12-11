import { allowedCurators } from "modules/app/curators";
import { useParams } from "react-router-dom";
import CuratorLaunchPage from "./curator-launch-page";

export function CuratorDedicatedPage() {
  const params = useParams();
  const curator = allowedCurators.find((c) => c.id === params.curatorId);

  if (!curator) {
    throw new Error("Curator not found");
  }

  return <CuratorLaunchPage curator={curator} />;
}
