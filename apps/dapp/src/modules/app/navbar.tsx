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

type LinkConfig = {
  label: string;
  href: string;
  target?: React.HTMLProps<HTMLAnchorElement>["target"];
};

export const curator = { label: "Curator", href: "/curator" };

export const testnetLinks = [
  { label: "Faucet", href: "/faucet" },
  { label: "Deploy", href: "/deploy" },
  { label: "Launch", href: "/create/auction" },
];

export const defaultLinks = [
  { label: "Launches", href: "/#" },
  { label: "Curators", href: "/curators" },
];

export const mobileSideLinks = [
  { label: "Referrals", href: "/refer" },
  {
    label: "Docs",
    href: "https://axis.finance/docs/overview",
    target: "_blank",
  },
];

export const desktopLinks = [...defaultLinks, ...mobileSideLinks];

type NavbarProps = {
  links?: LinkConfig[];
  mobile?: boolean;
  showAll?: boolean;
  onlyDefault?: boolean;
  className?: string;
};

export default function Navbar(props: NavbarProps) {
  const isRoot = window.location.hash === "#/";
  const { isCurator, pendingCurationsCount } = useCurator();

  const links: LinkConfig[] = React.useMemo(() => {
    if (props.links) return props.links;
    if (props.onlyDefault) return defaultLinks;

    const _links = props.mobile && !props.showAll ? defaultLinks : desktopLinks;
    //Only show curator link if connected address is a curator for any auction
    const curatorLink = isCurator ? [curator] : [];
    return [..._links, ...curatorLink];
  }, [props.links, props.onlyDefault, isCurator]);

  return (
    <NavigationMenu className="bg-surface-tertiary">
      <NavigationMenuList
        className={cn(
          props.mobile && "flex w-full flex-col items-end",
          props.className,
        )}
      >
        {links.map((l) => (
          <NavigationMenuItem key={l.href}>
            <NavigationMenuLink asChild>
              <NavLink to={l.href} target={l.target ?? "_self"}>
                {({ isActive }) => (
                  <>
                    {l.label === "Curator" && !!pendingCurationsCount && (
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
                      {l.label}
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
