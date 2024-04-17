import { defaultTokenlist } from "@repo/deployments";
import type { Token } from "@repo/types";

const getToken = ({
  chainId,
  address,
}: {
  address: string;
  chainId: number;
}): Token | undefined => {
  return [defaultTokenlist] // TODO: does this need to support multiple token lists?
    .flatMap((t) => t.tokens)
    .find(
      (t) =>
        t.address.toLocaleLowerCase().includes(address.toLocaleLowerCase()) &&
        t.chainId == chainId,
    );
};

export { getToken };
