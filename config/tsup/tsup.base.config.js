import { defineConfig } from "tsup";

export default function createConfig(overrides = {}) {
  return defineConfig({
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    dts: true,
    sourcemap: true,
    clean: true,
    ...overrides,
  });
}
