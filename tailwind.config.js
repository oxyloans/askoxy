// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "light-bot-bg": "#f9f5ff",
        "light-bot-text": "#1a1a1a",
        paper: "#faf8f3",
        ink: {
          DEFAULT: "#1a1625",
          soft: "#4b4658",
          faint: "#777181",
        },
        plum: {
          DEFAULT: "#4b2142",
          dark: "#30132a",
          light: "#704065",
        },
        gold: {
          DEFAULT: "#d4af37",
          soft: "#e2c766",
        },
        royal: "#5b3f92",
      },
      fontFamily: {
        body: ["Inter", "system-ui", "sans-serif"],
        display: ["Georgia", "Times New Roman", "serif"],
      },
       keyframes: {
        fly: {
          '0%': { transform: 'translateX(-20%)' },
          '100%': { transform: 'translateX(120%)' },
        },
        drive: {
          '0%': { transform: 'translateX(-20%)' },
          '100%': { transform: 'translateX(120%)' },
        },
        rail: {
          '0%': { transform: 'translateX(-20%)' },
          '100%': { transform: 'translateX(120%)' },
        },
      },
      animation: {
        fly: 'fly 3s linear infinite',
        drive: 'drive 4s linear infinite',
        rail: 'rail 5s linear infinite',
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
