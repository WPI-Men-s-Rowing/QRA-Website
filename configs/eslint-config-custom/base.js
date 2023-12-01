// @ts-check
const { defineConfig } = require("eslint-define-config");
const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/// <reference types="@eslint-types/typescript-eslint" />

module.exports = defineConfig({
  root: true,
  env: { es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "prettier",
    "turbo",
    "plugin:mdx/recommended",
  ],
  rules: {
    semi: "error",
    "no-empty": "warn",
    "no-empty-function": "warn",
    "@typescript-eslint/no-unused-vars": "warn",
    "prefer-const": "warn",
    "@typescript-eslint/no-empty-interface": "warn",
  },
  ignorePatterns: ["dist/", "node_modules/", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  parserOptions: {
    project,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
});
