// @ts-check
const { defineConfig } = require("eslint-define-config");

/// <reference types="@eslint-types/typescript-eslint" />

module.exports = defineConfig({
  env: { browser: true, node: true },
  extends: [
    "./base",
    "next",
    "plugin:react-hooks/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:storybook/recommended",
  ],
  rules: {
    "@typescript-eslint/no-shadow": [
      "warn",
      { builtinGlobals: true, hoist: "functions", allow: ["Image"] },
    ],
  },
  plugins: ["react"],
  settings: {
    react: {
      version: "detect",
    },
  },
  ignorePatterns: ["!.storybook"],
});
