import ConnectButton from "../../components/connect-button";
import { Link } from "react-router-dom";
import Navbar from "./navbar";

export function AppHeader() {
  return (
    <div className="max-w-limit mx-auto">
      <div className="mx-auto flex max-h-[88px] justify-between py-6">
        <div className="flex cursor-pointer items-center gap-x-4 text-4xl">
          <Link to="/">
            <div className="flex gap-x-2">
              <img src="/images/origin-logo.svg" />
            </div>
          </Link>
          <Navbar />
        </div>

        <div className="flex items-center justify-end gap-x-2">
          <ConnectButton />
        </div>
      </div>
    </div>
  );
}
