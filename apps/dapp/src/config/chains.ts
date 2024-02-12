import { http } from "wagmi";
import { Chain, blastSepolia, mainnet } from "viem/chains";
import { environment } from "./environment";

const rpcURLs = {
  [blastSepolia.id]:
    "https://broken-magical-hill.blast-sepolia.quiknode.pro/3bdd9ff197592ef9652987ef7dcf549e759c713d/",
};

//Mainnet Config
export const mainnets: [Chain, ...Chain[]] = [mainnet];
const mainnetConfig = {
  chains: mainnets,
  transports: {
    [mainnet.id]: http(""),
  },
};

//Testnet Config
export const testnets: [Chain, ...Chain[]] = [blastSepolia];
const testnetConfig = {
  chains: testnets,
  transports: {
    [blastSepolia.id]: http(rpcURLs[blastSepolia.id]),
  },
};

export const activeChains = environment.isTestnet ? testnets : mainnets;

export const activeConfig = environment.isTestnet
  ? testnetConfig
  : mainnetConfig;
