import '../src/app/globals.css';
import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview } from '@storybook/react';

// Using unknown here suppresses a TS warning. Not sure how else to get around it =)
export const decorators: unknown = [
  withThemeByClassName({
    themes: {
      light: "light",
      dark: "dark",
    },
    defaultTheme: "light",
  }),
];

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;