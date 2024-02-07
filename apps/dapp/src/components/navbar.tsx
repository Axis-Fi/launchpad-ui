import {
  Button,
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@repo/ui";
import { NavLink } from "react-router-dom";

const links = [
  { title: "Auctions", href: "/auctions" },
  { title: "Create", href: "/create/auction" },
  { title: "Dashboard", href: "/dashboard" },
];

export default function Navbar() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {links.map((l) => (
          <NavigationMenuItem key={l.href}>
            <NavigationMenuLink>
              <NavLink to={l.href}>
                {({ isActive }) => (
                  <Button
                    variant="link"
                    className={isActive ? "underline" : ""}
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
