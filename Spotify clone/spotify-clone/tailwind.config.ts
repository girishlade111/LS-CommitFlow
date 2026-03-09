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
        "spotify-green": "#1DB954",
        "spotify-green-hover": "#1ED760",
        "spotify-green-active": "#169C46",
        "spotify-black": "#121212",
        "spotify-card": "#181818",
        "spotify-card-hover": "#282828",
        "spotify-elevated": "#242424",
        "spotify-highlight": "#2A2A2A",
        "spotify-white": "#FFFFFF",
        "spotify-subdued": "#A7A7A7",
        "spotify-faint": "#727272",
      },
      fontFamily: {
        figtree: ["Figtree", "sans-serif"],
      },
      keyframes: {
        "playing-bar-1": {
          "0%, 100%": { height: "60%" },
          "25%": { height: "100%" },
          "50%": { height: "40%" },
          "75%": { height: "80%" },
        },
        "playing-bar-2": {
          "0%, 100%": { height: "80%" },
          "25%": { height: "40%" },
          "50%": { height: "100%" },
          "75%": { height: "60%" },
        },
        "playing-bar-3": {
          "0%, 100%": { height: "40%" },
          "25%": { height: "80%" },
          "50%": { height: "60%" },
          "75%": { height: "100%" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        "toast-slide": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "playing-bar-1": "playing-bar-1 0.8s ease-in-out infinite",
        "playing-bar-2": "playing-bar-2 0.8s ease-in-out infinite 0.2s",
        "playing-bar-3": "playing-bar-3 0.8s ease-in-out infinite 0.4s",
        shimmer: "shimmer 2s linear infinite",
        "toast-slide": "toast-slide 0.3s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
