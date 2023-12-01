// @ts-check
const { defineConfig } = require("eslint-define-config");

/// <reference types="@eslint-types/typescript-eslint" />

module.exports = defineConfig({
  extends: ["@qra-website/custom/node"],
});
