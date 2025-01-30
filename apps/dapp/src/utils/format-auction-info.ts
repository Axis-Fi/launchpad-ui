import { Auction } from "@axis-finance/types";

export function formatAuctionInfo({ info }: Pick<Auction, "info">) {
  const formatted = Object.entries(info?.links).map(([key, value]) => ({
    id: key,
    url: value,
  }));
  console.log({ formatted });

  const result = {
    ...info,
    links,
  };

  console.log({ result });
}
