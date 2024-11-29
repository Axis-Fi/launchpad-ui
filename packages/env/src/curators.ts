import { Address, Curator } from "@repo/types";

export const allowedCurators: Curator[] = [
  {
    name: "Baseline Markets",
    type: "platform",
    address: [
      "0x93d2f6a92af6add436df7ba185dd736ec13f0aaa",
      "0x32f33a14e36cb75b3f58e1822418599e3f075ffb",
      "0x82A22117b8A0AD72628Bf4b01BF822aeea88B9b3",
    ],
    twitter: "baselinemarkets",
    website: "https://www.baseline.markets/",
    avatar: "/images/baseline-markets.png",
    description:
      "Baseline creates tokens with programmatic liquidity and rising floor prices. Their innovative tokenomics system combines automated market-making with built-in protections to ensure sustainable value growth through all market conditions.",
  },
  {
    name: "Revelo Intel",
    type: "curator",
    address: "0x63c4fC41B61853997d51b73419a5Cf41C4be1A6F",
    twitter: "ReveloIntel",
    website: "https://revelointel.com/",
    avatar: "/images/revelo.jpg",
    description:
      "Revelo Intel is a firm that prepares institutional-grade research focusing on DeFi ecosystems, protocols, and narratives. Our comprehensive coverage allows users and investor to do proper due diligence in this fast-paced and complex space.",
    reportURL:
      "https://revelointel.com/wp-content/uploads/2024/08/Aurelius-Finance-Overview-by-Revelo-Intel.pdf",
  },
];

export const allowedCuratorAddresses: string[] = allowedCurators
  .flatMap((c) => c.address)
  .map((c) => c.toLowerCase());

export const getCurator = (address: Address | string) => {
  const targetAddress = address.toLowerCase();

  return allowedCurators.find((c) => {
    if (Array.isArray(c.address)) {
      return c.address.map((a) => a.toLowerCase()).includes(targetAddress);
    }
    return c.address.toLowerCase() === targetAddress;
  });
};
