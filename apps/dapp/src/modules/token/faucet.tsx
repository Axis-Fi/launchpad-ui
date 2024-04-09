import { Token } from "@repo/types";
import { Button } from "@repo/ui";
import { useMintToken } from "./use-mint-token";

type FaucetProps = {
  token: Token;
  amount?: string | number;
};

export function Faucet({ token, amount = 10000 }: FaucetProps) {
  const mint = useMintToken(token, amount.toString());
  console.log({ mint });

  return (
    <div className="flex items-center gap-x-1">
      <Button onClick={mint.handleMint}>Mint</Button>
    </div>
  );
}
