import { defineConfig } from "@wagmi/cli";

import abiMap from "./src/abis/index";

export default defineConfig({
  out: "src/abis/generated.ts",
  contracts: Object.entries(abiMap).map(([name, abi]) => ({
    name,
    //@ts-expect-error type mismatch
    abi: abi.abi,
  })),
});
