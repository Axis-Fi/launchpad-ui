import config from "@repo/tailwind-config";

/** @type {import('tailwindcss').Config} */
export default {
  ...config,
  content: [
    "../../packages/ui/src/**/*.{ts,tsx,js,jsx}",
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
  ],
};
