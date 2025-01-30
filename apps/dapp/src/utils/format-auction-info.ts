import { Auction } from "@axis-finance/types";

export function formatAuctionInfo({ info }: Pick<Auction, "info">) {
  console.log({ info });
  if (!info?.links) return info;

  const links = Object.entries(info?.links).map(([key, value]) => ({
    id: key,
    url: value,
  }));

  const result = {
    ...info,
    links,
  };

  console.log({ result });
  return result;
}
