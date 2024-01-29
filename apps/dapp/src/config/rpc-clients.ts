import { createPublicClient, http } from "viem";
import { blastSepolia } from "viem/chains";

const testnets = [
  { chain: blastSepolia, rpcURL: blastSepolia.rpcUrls.default.http[0] },
];

export const testnetClients = testnets.reduce((clients, { chain, rpcURL }) => {
  const client = createPublicClient({
    chain,
    transport: http(rpcURL),
  });

  return { ...clients, [chain.id]: client };
}, {});

//TODO: add environment check when adding mainnet clients
export const activeClients = testnetClients;
