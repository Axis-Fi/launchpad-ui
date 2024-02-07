import type { Auction } from "src/types";

const data: Auction[] = [
  {
    id: 1,
    chainId: 420,
    quoteToken: "DAI",
    payoutToken: "TEX",
    capacity: 100000000,
    deadline: 123412341,
  },
  {
    id: 2,
    chainId: 1,
    quoteToken: "USDC",
    payoutToken: "JEM",
    capacity: 100000,
    deadline: 123413341,
  },
  {
    id: 3,
    chainId: 1,
    quoteToken: "USDT",
    payoutToken: "OIT",
    capacity: 100000,
    deadline: 123413341,
  },
  {
    id: 4,
    chainId: 1,
    quoteToken: "WBTC",
    payoutToken: "AFX",
    capacity: 100000,
    deadline: 123413341,
  },
];

export default function useAuctions() {
  return {
    data,
    getAuction: (chainId?: number | string, id?: number | string) =>
      data.find((a) => a.chainId === Number(chainId) && a.id === Number(id)),
  };
}
