import type { StorybookConfig } from "@storybook/nextjs";

import path, { dirname, join } from "path";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
// This auto-generated code has errors, this is the safest way to get around them
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
}

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@storybook/addon-onboarding"),
    getAbsolutePath("@storybook/addon-interactions"),
    getAbsolutePath("@storybook/addon-themes"),
    getAbsolutePath("@storybook/addon-a11y"),
  ],
  framework: {
    // This auto-generated code has errors, this is the safest way to get around them
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    name: getAbsolutePath("@storybook/nextjs"),
    options: {},
  },
  // This resolver ensures that the @/ aliases used in Next will work here.
  // Even though we're using Next, webpack is used by storybook because
  webpackFinal: (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@": path.resolve(__dirname, "../src"),
        "@public": path.resolve(__dirname, "../public"),
      };
    }
    return Promise.resolve(config);
  },
  docs: {
    autodocs: "tag",
  },
};
export default config;
