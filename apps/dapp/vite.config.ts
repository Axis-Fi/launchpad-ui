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
        //Update plausible script domain
        const updated = html.replace(
          /data-domain="axis-origin/,
          'data-domain="axis-testnet',
        );

        //Update page title
        return updated.replace(
          /<title>(.*?)<\/title>/,
          `<title>Origin Testnet</title>`,
        );
      }
    },
  };
}
