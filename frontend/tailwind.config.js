const colors = require("./constants/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./providers/**/*.{js,jsx,ts,tsx}",
  ],
  // "class" is required: NativeWind defaults to "media" (OS scheme), which would
  // make every dark: variant ignore the in-app theme toggle.
  darkMode: "class",
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors,
      fontFamily: {
        nunito: ["Nunito_400Regular", "sans-serif"],
        "nunito-semibold": ["Nunito_600SemiBold", "sans-serif"],
        "nunito-bold": ["Nunito_700Bold", "sans-serif"],
        "nunito-extrabold": ["Nunito_800ExtraBold", "sans-serif"],
      },
      borderRadius: {
        xl: "16px",
        "2xl": "20px",
        "3xl": "24px",
      },
      boxShadow: {
        card: "0 2px 12px rgba(108, 99, 255, 0.08)",
        "card-hover": "0 4px 20px rgba(108, 99, 255, 0.15)",
        glow: "0 0 20px rgba(108, 99, 255, 0.3)",
      },
    },
  },
  plugins: [],
};
