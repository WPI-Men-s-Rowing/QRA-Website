import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        secondary: "#f0f0f0",
        divider: "rgba(49,49,49,0.15)",
        subtext: "rgba(49,49,49,0.5)",
        "background-subtext": "rgba(250,250,250,0.5)",
        background: "#FAFAFA",
        black: "#313131",
        red: "#730000",
        blue: "#230088",
        auxiliary: "#CD801F",
        tertiary: "#3A3A3A",
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
  darkMode: "class",
};
export default config;
