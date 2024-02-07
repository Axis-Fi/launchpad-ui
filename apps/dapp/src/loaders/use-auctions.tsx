import type { Auction, Token } from "src/types";

const quoteToken: Token = {
  symbol: "DAI",
  chainId: 1,
  decimals: 18,
  address: "0x420420420420",
  name: "Dai",
};

const payoutToken: Token = {
  symbol: "mAXIS",
  chainId: 1,
  decimals: 18,
  address: "0x420402420420",
  name: "Axis",
};

const data: Auction[] = [
  {
    status: "created",
    id: 1,
    chainId: 420,
    quoteToken,
    payoutToken,
    capacity: 100000000,
    deadline: 123412341,
  },
  {
    status: "live",
    id: 2,
    chainId: 1,
    quoteToken,
    payoutToken,
    capacity: 100000,
    deadline: 123413341,
  },
  {
    status: "concluded",
    id: 3,
    chainId: 1,
    quoteToken,
    payoutToken,
    capacity: 100000,
    deadline: 123413341,
  },
  {
    status: "decrypted",
    id: 4,
    chainId: 1,
    quoteToken,
    payoutToken,
    capacity: 100000,
    deadline: 123413341,
  },
  {
    status: "settled",
    id: 5,
    chainId: 1,
    quoteToken,
    payoutToken,
    capacity: 10000000,
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
