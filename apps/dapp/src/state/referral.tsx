import { useAtomValue, useSetAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Address } from "viem";

export const refAtom = atomWithStorage<Address>(
  "referrer",
  `0x${"0".repeat(40)}`,
);

export const useSetReferrer = () => useSetAtom(refAtom);
export const useReferrer = () => useAtomValue(refAtom);
