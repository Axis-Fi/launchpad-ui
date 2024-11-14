import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

export default function createConfig(packageDir) {
  return {
    input: `${packageDir}/src/index.ts`,
    output: [
      {
        file: `${packageDir}/dist/bundle.cjs.js`,
        format: "cjs",
        sourcemap: true,
        plugins: [terser()],
      },
      {
        file: `${packageDir}/dist/bundle.esm.js`,
        format: "esm",
        sourcemap: true,
        plugins: [terser()],
      },
    ],
    plugins: [
      resolve({
        preferBuiltins: true,
        extensions: [".ts", ".tsx", ".js", ".jsx"],
      }),
      commonjs(),
      typescript({
        tsconfig: `${packageDir}/tsconfig.json`,
        exclude: ["**/*.test.ts", "**/*.spec.ts", "**/test/**"],
      }),
    ],
    external: [/^@repo\/.*/, "viem", "react", "react-dom"],
  };
}
