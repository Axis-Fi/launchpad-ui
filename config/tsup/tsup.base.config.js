import { defineConfig } from "tsup";

export default function createConfig(overrides = {}) {
  return defineConfig({
    entry: ["src/index.ts"],
    format: "esm",
    dts: {
      compilerOptions: {
        declaration: true,
        declarationMap: true,
        module: "es2020",
      },
    },
    sourcemap: true,
    clean: true,
    ...overrides,
  });
}
