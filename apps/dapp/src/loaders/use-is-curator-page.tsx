import { useLocation } from "react-router-dom";

export function useIsCuratorPage() {
  const location = useLocation();

  return location.pathname.includes("/launches");
}
