import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";

const config: Config = {
  // IMPORTANT: This tells Tailwind to scan your src folder for classes
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // You can add custom LMS brand colors here later
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [tailwindAnimate], // Recommended for Radix UI components
};

export default config;
