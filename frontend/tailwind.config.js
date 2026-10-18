/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0b0a0f", bg2: "#100f16", panel: "#15141c", line: "#2a2832",
        ink: "#f3efe8", muted: "#9a95a3",
        gold: "#d9b878", copper: "#e08a6b", sage: "#8fd6b0",
      },
      fontFamily: {
        sans: ['"Bricolage Grotesque"', "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "Menlo", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};
