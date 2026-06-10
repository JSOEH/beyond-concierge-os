/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#FBFAF7",
          soft: "#F4F2EC",
          card: "#FFFFFF",
        },
        charcoal: {
          50: "#F5F5F6",
          100: "#E7E7E9",
          200: "#C9C9CD",
          300: "#A3A3A9",
          400: "#6F6F77",
          500: "#48484F",
          600: "#34343A",
          700: "#26262B",
          800: "#1B1B1F",
          900: "#121215",
          950: "#0B0B0D",
        },
        gold: {
          50: "#FBF6EA",
          100: "#F5E9C9",
          200: "#EAD49A",
          300: "#DFBE6C",
          400: "#D2AA4A",
          500: "#C8A862",
          600: "#B08D3E",
          700: "#8C6E2F",
          800: "#6A5324",
          900: "#4A3A1A",
        },
        emerald: {
          soft: "#E7F4EE",
          DEFAULT: "#1F9D6B",
          deep: "#0F6B47",
        },
        rose: {
          soft: "#FBEAEA",
          DEFAULT: "#D2484A",
          deep: "#9B2C2E",
        },
        amber: {
          soft: "#FCF1DD",
          DEFAULT: "#D9920B",
          deep: "#9C6606",
        },
        sky: {
          soft: "#E6F1F8",
          DEFAULT: "#2E7CB8",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
        display: ["Fraunces", "Georgia", "ui-serif", "serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(18,18,21,0.04), 0 8px 24px -12px rgba(18,18,21,0.12)",
        "card-hover": "0 1px 2px rgba(18,18,21,0.05), 0 18px 40px -16px rgba(18,18,21,0.22)",
        gold: "0 8px 30px -10px rgba(176,141,62,0.45)",
        inset: "inset 0 1px 0 rgba(255,255,255,0.6)",
      },
      borderRadius: {
        xl: "0.9rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      backgroundImage: {
        "gold-sheen": "linear-gradient(135deg, #DFBE6C 0%, #C8A862 45%, #B08D3E 100%)",
        "charcoal-deep": "linear-gradient(180deg, #1B1B1F 0%, #121215 100%)",
        grain:
          "radial-gradient(circle at 1px 1px, rgba(18,18,21,0.045) 1px, transparent 0)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "pulse-gold": {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(200,168,98,0.4)" },
          "50%": { boxShadow: "0 0 0 8px rgba(200,168,98,0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both",
        shimmer: "shimmer 1.6s infinite",
        "pulse-gold": "pulse-gold 2.2s infinite",
      },
    },
  },
  plugins: [],
};
