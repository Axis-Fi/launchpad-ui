import { Link } from "react-router-dom";
import AxisIcon from "./axis-icon";
import { useCuratorPage } from "loaders/use-curator-page";

export function NavigationIcon() {
  const { isCuratorPage, curator } = useCuratorPage();

  return (
    <Link
      className="flex cursor-pointer items-center gap-x-4 pl-4 text-4xl"
      to="/"
    >
      <div className="flex gap-x-2">
        {isCuratorPage ? (
          <img src={curator?.avatar} className="size-12 " />
        ) : (
          <AxisIcon />
        )}
      </div>
    </Link>
  );
}
