/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6C63FF", // Roxo suave (Organizze style)
        accent: "#FFD166", // Amarelo destaque
        background: "#F9FAFB", // Fundo cinza-claro
        textPrimary: "#1F2937", // Cinza escuro
        textSecondary: "#6B7280", // Cinza médio
      },
    },
  },
  plugins: [],
};
