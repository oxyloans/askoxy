// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "light-bot-bg": "#f9f5ff",
        "light-bot-text": "#1a1a1a",
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
