import ConnectButton from "../../components/connect-button";
import { Link } from "react-router-dom";
import { CaretUpIcon } from "@radix-ui/react-icons";
import Navbar from "./navbar";
import { cn } from "@repo/ui";
import React from "react";
import { useMediaQueries } from "loaders/use-media-queries";

export function AppControl() {
  const { isTabletOrMobile } = useMediaQueries();
  return (
    <div className="xl:max-w-limit sticky z-20 mx-auto w-full max-w-sm border-t">
      <div className="mx-auto flex max-h-[88px] justify-between py-6">
        <OriginNavIcon />
        <Navbar onlyDefault={isTabletOrMobile} />
        <div className="flex items-center justify-between gap-x-2">
          <ConnectButton className="hidden xl:block" size="md" />
          {isTabletOrMobile && <AppMenu />}
        </div>
      </div>
    </div>
  );
}

export function AppMenu() {
  const [open, setOpen] = React.useState<boolean>();

  return (
    <div className="relative ">
      <div
        className={cn(
          "bg-surface-tertiary/50 absolute -left-32 bottom-20 mx-auto mr-8 size-40 h-[400px] w-[270px] translate-x-full rounded-md p-2 pr-8 shadow-md backdrop-blur transition-all ",
          open && "translate-x-0",
        )}
      >
        <div className="flex h-full w-full flex-col items-start justify-center">
          <Navbar mobile />
          <ConnectButton />
        </div>
      </div>
      <CaretUpIcon
        className={cn("size-8 transition-all", open && "-rotate-90")}
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
