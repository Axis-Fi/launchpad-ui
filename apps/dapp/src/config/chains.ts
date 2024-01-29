import { http } from "wagmi";
import { Chain, arbitrumGoerli, blastSepolia, mainnet } from "viem/chains";
import { environment } from "./environment";

//Mainnet Config
export const mainnets: [Chain, ...Chain[]] = [mainnet];
const mainnetConfig = {
  chains: mainnets,
  transports: {
    [mainnet.id]: http(""),
  },
};

//Testnet Config
export const testnets: [Chain, ...Chain[]] = [arbitrumGoerli, blastSepolia];
const testnetConfig = {
  chains: testnets,
  transports: {
    [blastSepolia.id]: http(""),
    [arbitrumGoerli.id]: http(""),
  },
};

export const activeChains = environment.isTestnet ? testnets : mainnets;

export const activeConfig = environment.isTestnet
  ? testnetConfig
  : mainnetConfig;
