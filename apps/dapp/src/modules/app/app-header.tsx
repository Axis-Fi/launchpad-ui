import ConnectButton from "../../components/connect-button";
import { Button } from "@repo/ui";
import { Link } from "react-router-dom";
import Navbar from "./navbar";
import { AppVersion } from "./app-version";

export function AppHeader() {
  return (
    <div>
      <div className="mx-auto flex max-h-[88px] justify-between py-6">
        <div className="flex cursor-pointer items-center gap-x-4 text-4xl">
          <Link to="/">
            <div className="flex gap-x-2">
              <img width={80} height={26} src="/images/wordmark.svg" />
              {/*<img width={30} height={26} src="/images/logo.svg" />*/}
              <AppVersion className="absolute top-14 ml-1 " />
            </div>
          </Link>
          <Navbar />
        </div>

        <div className="flex items-center justify-end gap-x-2">
          <Link to="/create/auction">
            <Button className="uppercase">Create Auction</Button>
          </Link>
          <ConnectButton />
        </div>
      </div>
      <div className="nav-separator" />
    </div>
  );
}
