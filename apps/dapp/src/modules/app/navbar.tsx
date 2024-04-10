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
const testnetLinks = [
  { title: "Get Tokens", href: "/faucet" },
  { title: "Deploy", href: "/deploy" },
];

export default function Navbar() {
  const isRoot = window.location.hash === "#/";
  const { isCurator, pendingCurationsCount } = useCurator();

  //Only show curator link if connected address is a curator for any auction
  const links = React.useMemo(
    () => (isCurator ? [curator, ...testnetLinks] : testnetLinks),
    [isCurator],
  );

  return (
    <NavigationMenu>
      <NavigationMenuList>
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
                        "px-2 uppercase",
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
      <Badge size="round" className="absolute -right-2 top-2 h-min">
        {count}
      </Badge>
    </div>
  );
}
