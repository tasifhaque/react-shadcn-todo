import { useThemeStore } from "@/store/themeStore";
import { useEffect, type ReactNode } from "react";

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { theme } = useThemeStore();
  useEffect(() => {
    if (theme === "dark") {
      if (document.documentElement.classList.contains("light")) {
        document.documentElement.classList.remove("light");
      }
      document.documentElement.classList.add("dark");
    } else {
      if (document.documentElement.classList.contains("dark")) {
        document.documentElement.classList.remove("dark");
      }
      document.documentElement.classList.add("light");
    }
  }, [theme]);
  return children;
};

export default ThemeProvider;
