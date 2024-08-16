import { FlaskConicalIcon, SearchCheckIcon } from "lucide-react";
import ConnectButton from "../../components/connect-button";
import { Link, useNavigate } from "react-router-dom";
import { CaretUpIcon } from "@radix-ui/react-icons";
import Navbar, { testnetLinks } from "./navbar";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  cn,
} from "@repo/ui";
import React from "react";
import { useMediaQueries } from "loaders/use-media-queries";
import { environment } from "@repo/env";
import { TokenWrapper } from "modules/token/token-wrapper";

export function AppControl() {
  const { isTabletOrMobile } = useMediaQueries();
  const navigate = useNavigate();

  return (
    <div className="lg:max-w-limit bg-surface-tertiary fixed bottom-0 z-20 mx-auto w-full lg:static lg:bg-transparent ">
      <div className="mx-auto flex max-h-[64px] justify-between py-6 lg:max-h-[88px]">
        <div className="flex gap-x-3">
          <OriginNavIcon />
          <Navbar onlyDefault={isTabletOrMobile} />
        </div>
        <div className="flex items-center justify-between gap-x-2">
          {!environment.isProduction && !isTabletOrMobile && (
            <div className="border-b-tertiary-300 mr-8 flex items-center border-b-2">
              <Tooltip content="These features are only available on testnet">
                <div className="w-8">
                  <FlaskConicalIcon width={24} height={24} />
                </div>
              </Tooltip>
              <Navbar links={testnetLinks} />
            </div>
          )}

          <Button
            size="icon"
            variant="ghost"
            className="size-[64px]"
            onClick={() => navigate("/curator")}
          >
            <SearchCheckIcon />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="secondary" size="sm">
                Wrap
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[340px]">
              <TokenWrapper />
            </PopoverContent>
          </Popover>
          <ConnectButton className="hidden md:block" size="md" />
          {isTabletOrMobile && <AppMenu />}
        </div>
      </div>
    </div>
  );
}

export function AppMenu() {
  const [open, setOpen] = React.useState<boolean>();

  const handleCloseMenu = () => setOpen(false);

  return (
    <div className="relative">
      <div
        className={cn(
          "bg-surface-tertiary absolute -left-40 bottom-[90px] mx-auto flex size-fit min-h-[300px] min-w-[200px] translate-x-[105%] flex-col items-end rounded-md p-2 px-8 pr-8 transition-all duration-300",
          open && "translate-x-0",
        )}
      >
        {!environment.isProduction && (
          <Navbar
            mobile
            links={testnetLinks}
            className="border-b-tertiary-300 border-b-2"
            onNavClick={handleCloseMenu}
          />
        )}
        <Navbar mobile showAll onNavClick={handleCloseMenu} />
        <ConnectButton className="border-t lg:border-t-0" />
      </div>
      <CaretUpIcon
        className={cn("mr-3 size-8 transition-all ", open && "-rotate-90")}
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
