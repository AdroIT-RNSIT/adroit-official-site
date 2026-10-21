import { Moon, Sun } from "lucide-react";
import { useTheme } from "../lib/theme";

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Dark theme"
      onClick={toggleTheme}
      data-shell="theme"
      className="ui-switch flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors"
    >
      <span data-part="knob" className="pointer-events-none flex items-center justify-center">
        <Sun data-glyph="sun" size={15} strokeWidth={2} aria-hidden="true" />
        <Moon data-glyph="moon" size={15} strokeWidth={2} aria-hidden="true" />
      </span>
    </button>
  );
}
