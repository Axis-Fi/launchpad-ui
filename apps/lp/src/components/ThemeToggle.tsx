import * as React from "react";

import { Button } from "@repo/ui";

export function ThemeToggle() {
  const [theme, setThemeState] = React.useState<
    "theme-light" | "dark" | "system"
  >("theme-light");

  React.useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setThemeState(isDarkMode ? "dark" : "theme-light");
  }, []);

  React.useEffect(() => {
    const isDark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList[isDark ? "add" : "remove"]("dark");
  }, [theme]);

  return (
    <Button
      variant="ghost"
      size="sm"
      className="grad-theme-switcher h-6 w-6 rounded-full "
      onClick={() => setThemeState(theme === "dark" ? "theme-light" : "dark")}
    ></Button>
  );
}
