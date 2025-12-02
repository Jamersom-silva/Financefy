import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  // Ignora a pasta de build
  globalIgnores(["dist", "node_modules", "build"]),

  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],

    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    rules: {
      // ===============================
      // 🔹 Correções específicas
      // ===============================

      // Permite variáveis JSX (ex: handleSubmit, isOpen)
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^(isOpen|saving|handleSubmit)$",
        },
      ],

      // Permite funções usadas apenas em JSX
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",

      // Hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Estilo e legibilidade
      "no-console": "warn",
      "no-unused-vars": "off",
      "no-debugger": "warn",
      "react-refresh/only-export-components": "off",
    },
  },
]);
