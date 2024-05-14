import { Address, isAddress } from "viem";
import { chains } from "@repo/env";

const activeChains = chains.activeChains;
const idRegex = /(?<=\w)-(0x[0-9a-fA-F]+)-(\d+)/;

export function parseAuctionId(id: string): {
  chainId: number;
  auctionHouse: Address;
  lotId: string;
} {
  const [chain, auctionHouse, lotId] = id.split(idRegex);

  const chainId = activeChains.find((c) =>
    c.name.toLowerCase().includes(chain.replace("-", " ")),
  )?.id;

  if (!chainId) throw new Error(`Unable to find chain definition for ${chain}`);
  if (!isFinite(Number(lotId))) throw new Error("Invalid lotId");
  if (!isAddress(auctionHouse)) {
    throw new Error(`Invalid address provided for AuctionHouse`);
  }

  return {
    chainId,
    auctionHouse,
    lotId,
  };
}
