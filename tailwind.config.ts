/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          dark: "#0a0118",
          darker: "#050011",
          purple: "#6b46c1",
          blue: "#3b82f6",
          cyan: "#06b6d4",
          pink: "#ec4899",
          nebula: "#8b5cf6",
        },
      },
      animation: {
        orbit: "orbit 20s linear infinite",
        "orbit-slow": "orbit 30s linear infinite",
        "orbit-reverse": "orbit-reverse 25s linear infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        orbit: {
          "0%": {
            transform: "rotate(0deg) translateX(100px) rotate(0deg)",
          },
          "100%": {
            transform: "rotate(360deg) translateX(100px) rotate(-360deg)",
          },
        },
        "orbit-reverse": {
          "0%": {
            transform: "rotate(0deg) translateX(100px) rotate(0deg)",
          },
          "100%": {
            transform: "rotate(-360deg) translateX(100px) rotate(360deg)",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-glow": {
          "0%, 100%": {
            opacity: "1",
            boxShadow: "0 0 20px rgba(139, 92, 246, 0.5)",
          },
          "50%": {
            opacity: "0.8",
            boxShadow: "0 0 40px rgba(139, 92, 246, 0.8)",
          },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
    },
  },
  plugins: [],
};

module.exports = config;
