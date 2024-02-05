/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: ["class"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        "axis-light": "hsl(var(--axis-light))",
        "axis-dark": "hsl(var(--axis-light))",
        "axis-blue": "hsl(var(--axis-blue))",
        "axis-teal": "hsl(var(--axis-teal))",
        "axis-green": "hsl(var(--axis-green))",
        "axis-orange": "hsl(var(--axis-orange))",
        "axis-red": "hsl(var(--axis-red))",

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        sans: ["AeonikPro", ...defaultTheme.fontFamily.sans],
        mono: [...defaultTheme.fontFamily.mono],
        aeonpro: ["AeonikPro", ...defaultTheme.fontFamily.sans],
        aeonfono: ["AeonikFono", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    plugin(function ({ addBase }) {
      addBase({
        "@font-face": {
          fontFamily: "AeonikPro",
          fontWeight: "100 300",
          src: "url(/fonts/AeonikProTRIAL-Light.otf) format('opentype')",
          fontDisplay: "block",
        },
      });

      addBase({
        "@font-face": {
          fontFamily: "AeonikPro",
          fontWeight: "400 600",
          src: "url(/fonts/AeonikProTRIAL-Regular.otf) format('opentype')",
          fontDisplay: "block",
        },
      });

      addBase({
        "@font-face": {
          fontFamily: "AeonikPro",
          fontWeight: "700 1000",
          src: "url(/fonts/AeonikProTRIAL-Bold.otf) format('opentype')",
          fontDisplay: "block",
        },
      });

      addBase({
        "@font-face": {
          fontFamily: "AeonikFono",
          fontWeight: "100 300",
          src: "url(/fonts/AeonikFonoTRIAL-Light.otf) format('opentype')",
          fontDisplay: "block",
        },
      });

      addBase({
        "@font-face": {
          fontFamily: "AeonikFono",
          fontWeight: "400 600",
          src: "url(/fonts/AeonikFonoTRIAL-Regular.otf) format('opentype')",
          fontDisplay: "block",
        },
      });
      addBase({
        "@font-face": {
          fontFamily: "AeonikFono",
          fontWeight: "700 1000",
          src: "url('/fonts/AeonikFonoTRIAL-Bold.otf') format('opentype')",
          fontDisplay: "block",
        },
      });
    }),
  ],
};
