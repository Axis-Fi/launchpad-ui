import { Curator } from "@repo/types";

export const allowedCurators: Curator[] = [
  {
    name: "Baseline Markets",
    type: "platform",
    address: "0x32f33a14e36Cb75b3F58E1822418599e3f075Ffb",
    twitter: "baselinemarkets",
    website: "https://www.baseline.markets/",
    avatar: "/images/baseline-markets.png",
    description:
      "Baseline is a decentralized protocol that leverages Uniswap V3 to manage the liquidity and pricing of ERC20 tokens. By employing smart contracts to execute a basic market making strategy, Baseline eliminates the need for traditional market makers. Since the token controls its own market making operations, it can maintain a unique liquidity structure that helps facilitate positive price development.",
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
