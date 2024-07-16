import { environment } from "@repo/env";
import {
  Badge,
  Button,
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  cn,
} from "@repo/ui";
import { useCurator } from "modules/auction/hooks/use-curator";
import React from "react";
import { NavLink } from "react-router-dom";

const curator = { title: "Curator", href: "/curator" };
const refer = { title: "Refer Bidders", href: "/refer" };
const testnetLinks = [
  { title: "Get Tokens", href: "/faucet" },
  { title: "Deploy", href: "/deploy" },
];

const defaultLinks = [
  { title: "Launches", href: "/#" },
  { title: "Contact", href: "mailto:launch@axis.finance" },
  { title: "Docs", href: "https://axis.finance/docs/overview" },
];

export default function Navbar(props: {
  mobile?: boolean;
  onlyDefault?: boolean;
}) {
  const isRoot = window.location.hash === "#/";
  const { isCurator, pendingCurationsCount } = useCurator();
  const isProd = environment.isProduction;

  //Only show curator link if connected address is a curator for any auction
  const links = React.useMemo(() => {
    if (props.onlyDefault) return defaultLinks;
    const _links = isProd ? [] : testnetLinks;
    const curatorLink = isCurator ? [curator] : [];
    return [...defaultLinks, refer, ..._links, ...curatorLink];
  }, [isCurator, props.onlyDefault]);

  return (
    <NavigationMenu>
      <NavigationMenuList
        className={cn(props.mobile && "flex flex-col items-start text-right")}
      >
        {links.map((l) => (
          <NavigationMenuItem key={l.href}>
            <NavigationMenuLink asChild>
              <NavLink to={l.href}>
                {({ isActive }) => (
                  <>
                    {l.title === "Curator" && !!pendingCurationsCount && (
                      <CuratorNotification count={pendingCurationsCount} />
                    )}
                    <Button
                      variant="link"
                      className={cn(
                        "text-foreground px-2 uppercase",
                        (isActive || (isRoot && l.href === "/auctions")) && //TODO: check if theres a better way with react-router
                          "text-primary",
                      )}
                    >
                      {l.title}
                    </Button>
                  </>
                )}
              </NavLink>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

/** Notification count badge */
function CuratorNotification({ count }: { count: number }) {
  return (
    <div className="relative">
      <Badge
        color="alert"
        size="round"
        className="absolute -right-2 top-2 h-min px-1.5 text-xs "
      >
        {count}
      </Badge>
    </div>
  );
}
