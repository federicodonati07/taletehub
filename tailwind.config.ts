import {nextui} from '@nextui-org/theme';
import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/components/(avatar|badge|button|divider|dropdown|input|popover|select|skeleton|spinner|toggle|user|ripple|menu|form|listbox|scroll-shadow).js"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        poppins: ["var(--font-poppins)", "sans-serif"],
        lora: ["var(--font-roboto)", "sans-serif"],
      },
    },
  },
  plugins: [nextui()],
} satisfies Config;
