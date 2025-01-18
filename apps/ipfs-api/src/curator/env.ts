import type { Address } from "viem";
import { baseSepolia, base } from "viem/chains";

const registry =
  process.env.NODE_ENV === "production"
    ? {
        // base mainnet
        address: "0xA12307d3cba3F0854cf92faDce07f7bff0B6a2BA" as Address,
        chain: base, // TODO: update to base, and set address when deployed to mainnet
      }
    : {
        // base testnet
        address: "0xc94404218178149ebebfc1f47f0df14b5fd881c5" as Address,
        chain: baseSepolia,
      };

export { registry };
