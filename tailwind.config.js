// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // You can add custom colors here if you want to use Tailwind classes
      colors: {
        "light-bot-bg": "#f9f5ff",
        "light-bot-text": "#1a1a1a",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
