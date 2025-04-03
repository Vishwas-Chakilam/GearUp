
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full w-8 h-8 transition-all duration-300 ease-in-out"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Moon size={16} className="text-blue-300 transition-opacity duration-300" />
      ) : (
        <Sun size={16} className="text-yellow-500 transition-opacity duration-300" />
      )}
    </Button>
  );
};

export default ThemeToggle;
