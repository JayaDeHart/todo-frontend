import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        lightGray: "#333333",
        darkGray: "#0d0d0d",
        medGray: "#1a1a1a",
        lightBlue: "#4ea7dd",
        purple: "#5f60cc",
        blue: "#1e6e9f",
        offWhite: "#F2F2F2",
        gray: "#D9D9D9",
        graytext: "#808080",
        input: "#262626",
      },
    },
  },
  plugins: [],
} satisfies Config;
