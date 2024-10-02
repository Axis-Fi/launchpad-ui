import { Moon, Sun } from "lucide-react";

import { Button } from "..";
import { useTheme } from "./";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const isLight = theme === "light";
  const ThemeIcon = isLight ? Sun : Moon;

  return (
    <Button
      onClick={() => setTheme(isLight ? "dark" : "light")}
      size="icon"
      variant="link"
    >
      <ThemeIcon />
    </Button>
  );
}
