import { atom, useAtomValue, useSetAtom } from "jotai";
import { Address } from "viem";

export const refAtom = atom<Address>(`0x${"0".repeat(40)}`);

export const useSetReferrer = () => useSetAtom(refAtom);
export const useReferrer = () => useAtomValue(refAtom);
