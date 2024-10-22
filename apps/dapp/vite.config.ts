import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    transformHTML(mode),
    react(),
    tsconfigPaths(),
    nodePolyfills({ globals: { Buffer: true } }),
  ],
}));

function transformHTML(mode: string) {
  const env = loadEnv(mode, process.cwd());

  return {
    name: "html-transform",
    transformIndexHtml(html: string) {
      if (env.VITE_ENVIRONMENT !== "production") {
        return html.replace(
          /<title>(.*?)<\/title>/,
          `<title>Axis Testnet</title>`,
        );
      }
    },
  };
}
