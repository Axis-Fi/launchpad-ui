import {
  Button,
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  cn,
} from "@repo/ui";
import React from "react";
import { NavLink } from "react-router-dom";
import { featureToggles, type FeatureToggle } from "@repo/env";

type LinkConfig = {
  label: string;
  href: string;
  target?: React.HTMLProps<HTMLAnchorElement>["target"];
};

const toggledLink = (
  link: LinkConfig,
  toggle: FeatureToggle,
  notEnabled: boolean = false,
): [LinkConfig] | [] => {
  return (notEnabled ? !featureToggles[toggle] : featureToggles[toggle])
    ? [link]
    : [];
};

export const testnetLinks = [
  { label: "Faucet", href: "/faucet" },
  { label: "Deploy", href: "/deploy" },
  { label: "Launch", href: "/create/auction" },
];

export const defaultLinks = [
  { label: "Launches", href: "/#" },
  ...toggledLink({ label: "Points", href: "/points" }, "POINTS_PHASE_1"),
  { label: "Curators", href: "/curators" },
] satisfies LinkConfig[];

export const mobileSideLinks = [
  ...toggledLink(
    { label: "Referrals", href: "/refer" },
    "POINTS_PHASE_1",
    true,
  ),
  ...toggledLink(
    { label: "Leaderboard", href: "/leaderboard" },
    "POINTS_PHASE_1",
  ),
  { label: "Bridge", href: "/bridge" },
  {
    label: "Docs",
    href: "https://axis.finance/docs/overview",
    target: "_blank",
  },
] satisfies LinkConfig[];

export const desktopLinks = [...defaultLinks, ...mobileSideLinks];

type NavbarProps = {
  links?: LinkConfig[];
  mobile?: boolean;
  showAll?: boolean;
  onlyDefault?: boolean;
  isCuratorPage?: boolean;
  className?: string;
  onNavClick?: () => void;
};

export default function Navbar(props: NavbarProps) {
  const isRoot = window.location.hash === "#/";

  const links: LinkConfig[] = React.useMemo(() => {
    if (props.links) return props.links;
    if (props.onlyDefault) return defaultLinks;

    const _links = props.mobile && !props.showAll ? defaultLinks : desktopLinks;

    return _links.filter(
      (
        r, //Disabled for curator specific pages
      ) => !props.isCuratorPage || !["Curators", "Referrals"].includes(r.label),
    );
  }, [props.links, props.onlyDefault]);

  return (
    <NavigationMenu>
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
                  <Button
                    variant="link"
                    onClick={() => props.onNavClick?.()}
                    className={cn(
                      "text-foreground px-2 uppercase",
                      (isActive || (isRoot && l.href === "/auctions")) && //TODO: check if theres a better way with react-router
                        "text-primary",
                    )}
                  >
                    {l.label}
                  </Button>
                )}
              </NavLink>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
