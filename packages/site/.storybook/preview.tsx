import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview, StoryFn } from "@storybook/react";
import { Inter } from "next/font/google";
import "../src/app/globals.css";

// Font used by the application
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Using unknown here suppresses a TS warning. Not sure how else to get around it =)
export const decorators: unknown = [
  withThemeByClassName({
    themes: {
      light: "light",
      dark: "dark",
    },
    defaultTheme: "light",
  }),
  (Story: StoryFn) => (
    <div className={`${inter.className} ${inter.variable}`}>
      <Story />
    </div>
  ),
];

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
