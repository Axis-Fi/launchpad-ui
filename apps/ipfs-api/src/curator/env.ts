import type { Address } from "viem";
import { baseSepolia } from "viem/chains";

const registry =
  process.env.ENVIRONMENT === "production"
    ? {
        // base mainnet
        address: "0xc94404218178149ebebfc1f47f0df14b5fd881c5" as Address,
        chain: baseSepolia, // TODO: update to base, and set address when deployed to mainnet
      }
    : {
        // base testnet
        address: "0xc94404218178149ebebfc1f47f0df14b5fd881c5" as Address,
        chain: baseSepolia,
      };

export { registry };
