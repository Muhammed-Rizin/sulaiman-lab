/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        anthropic: {
          bg: "#F7F4EF",
          "bg-soft": "#FBF9F6",
          border: "#E6E1D6",
          accent: "#D97757",
          dark: {
            bg: "#0F0F0F",
            border: "#262626",
          },
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["'Source Serif 4'", "serif"],
        mono: ["'Courier Prime'", "monospace"],
      },
    },
  },
  plugins: [],
};
