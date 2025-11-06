import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Alternar tema"
      className={`
        relative flex h-10 w-10 items-center justify-center rounded-full
        transition-all duration-500
        hover:scale-110 hover:shadow-md
        ${theme === "dark"
          ? "bg-[--color-secondary] text-[--color-primary]"
          : "bg-[--color-primary] text-white"}
      `}
    >
      {/* Ícones com animação de rotação e fade */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-transform duration-500 ${
          theme === "dark" ? "rotate-180" : "rotate-0"
        }`}
      >
        {theme === "dark" ? (
          <Moon className="h-5 w-5 text-[--color-primary]" />
        ) : (
          <Sun className="h-5 w-5 text-white" />
        )}
      </div>
    </button>
  );
}
