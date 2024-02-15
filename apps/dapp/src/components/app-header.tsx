import ConnectButton from "./connect-button";
import { Button } from "@repo/ui";
import { useNavigate } from "react-router-dom";

export function AppHeader() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="mx-auto flex max-h-[88px] justify-between py-6">
        <div className="flex cursor-pointer items-center gap-x-4 text-4xl">
          <div className="flex gap-x-2" onClick={() => navigate("/")}>
            <img width={80} height={26} src="/images/wordmark.svg" />
            <img width={30} height={26} src="/images/logo.svg" />
          </div>
        </div>

        <div className="flex items-center justify-end gap-x-2">
          <Button
            onClick={() => navigate("/create/auction")}
            className="uppercase"
          >
            Create Auction
          </Button>
          <ConnectButton />
        </div>
      </div>
      <div className="nav-separator" />
    </div>
  );
}
