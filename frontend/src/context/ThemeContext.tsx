import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useLayoutEffect,
} from "react";

interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";

    // 🌙 Carrega o tema salvo no localStorage ou detecta o sistema
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    if (saved) return saved;

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  });

  // ⚡ Aplica o tema antes da renderização (sem flash branco)
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);

    // Ajusta a cor de fundo instantaneamente
    document.body.style.backgroundColor =
      theme === "dark" ? "#0f1115" : "#f8f9ff";
  }, [theme]);

  // 🌗 Alterna entre claro e escuro
  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ✅ Hook personalizado
export const useTheme = () => useContext(ThemeContext);
