import { defineConfig } from "@wagmi/cli";

import abiMap from "./src/abis/sources/index";

export default defineConfig({
  out: "src/abis/generated.ts",
  contracts: Object.entries(abiMap).map(([name, abi]) => ({
    name,
    abi: abi[0],
  })),
});
