import {
  Button,
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  cn,
} from "@repo/ui";
import { NavLink } from "react-router-dom";

const links = [
  { title: "Auctions", href: "/auctions" },
  { title: "Dashboard", href: "/dashboard" },
];

export default function Navbar() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {links.map((l) => (
          <NavigationMenuItem key={l.href}>
            <NavigationMenuLink asChild>
              <NavLink to={l.href}>
                {({ isActive }) => (
                  <Button
                    variant="link"
                    className={cn("px-2 uppercase", isActive && "text-primary")}
                  >
                    {l.title}
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
