import * as dotenv from "dotenv";
import {
  createPublicClient,
  createWalletClient,
  http,
  type Address,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";

dotenv.config();

if (process.env.SIGNER_KEY == null) {
  throw Error("process.env.SIGNER_KEY is not set");
}

const signerKey = process.env.SIGNER_KEY! as Address;

const walletClient = createWalletClient({
  account: privateKeyToAccount(signerKey),
  transport: http(),
  chain: baseSepolia,
});

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

export { walletClient, publicClient };
