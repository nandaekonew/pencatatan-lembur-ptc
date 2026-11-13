import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ptc: {
          blue: "#0A2540",
          navy: "#003366",
          red: "#C41223",
          crimson: "#DC2626",
          green: "#43A047",
          sheetGreen: "#70AD47",
          sheetHeader: "#548235"
        }
      }
    },
  },
  plugins: [],
};
export default config;
