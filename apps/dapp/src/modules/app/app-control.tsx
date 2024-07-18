import { TestTube } from "lucide-react";
import ConnectButton from "../../components/connect-button";
import { Link } from "react-router-dom";
import { CaretUpIcon } from "@radix-ui/react-icons";
import Navbar, { testnetLinks } from "./navbar";
import { Tooltip, cn } from "@repo/ui";
import React from "react";
import { useMediaQueries } from "loaders/use-media-queries";
import { environment } from "@repo/env";

export function AppControl() {
  const { isTabletOrMobile } = useMediaQueries();

  return (
    <div className="lg:max-w-limit bg-surface-tertiary fixed bottom-0 z-20 mx-auto w-full lg:static lg:bg-transparent ">
      <div className="mx-auto flex max-h-[64px] justify-between py-6 lg:max-h-[88px]">
        <div className="flex gap-x-3">
          <OriginNavIcon />
          <Navbar onlyDefault={isTabletOrMobile} />
        </div>
        <div className="flex items-center justify-between gap-x-2">
          {!environment.isProduction && !isTabletOrMobile && (
            <div className="mr-8 flex items-center border-b">
              <Tooltip content="These features are only available on testnet">
                <div className="w-8">
                  <TestTube width={32} height={32} />
                </div>
              </Tooltip>
              <Navbar links={testnetLinks} />
            </div>
          )}
          <ConnectButton className="hidden md:block" size="md" />
          {isTabletOrMobile && <AppMenu />}
        </div>
      </div>
    </div>
  );
}

export function AppMenu() {
  const [open, setOpen] = React.useState<boolean>();

  return (
    <div className="relative">
      <div
        className={cn(
          "bg-surface-tertiary/50 absolute -left-40 bottom-12 mx-auto size-fit translate-y-[600px] rounded-t-md p-2 px-8 pr-8 backdrop-blur transition-all ",
          open && "translate-y-0",
        )}
      >
        <div className="flex size-full flex-col items-end ">
          <Navbar mobile links={testnetLinks} className="border-b" />
          <Navbar mobile />
          <ConnectButton className="border-t lg:border-t-0" />
        </div>
      </div>
      <CaretUpIcon
        className={cn(
          "mr-3 size-8 -rotate-180 transition-all ",
          open && "rotate-0",
        )}
        onClick={() => setOpen((prev) => !prev)}
      />
    </div>
  );
}

export function OriginNavIcon() {
  return (
    <Link
      className="flex cursor-pointer items-center gap-x-4 pl-4 text-4xl"
      to="/"
    >
      <div className="flex gap-x-2">
        <img src="/images/origin-logo.svg" />
      </div>
    </Link>
  );
}
