import { toHex } from "viem";

export function toKeycode(keycode: string): `0x${string}` {
  return toHex(keycode, { size: 5 });
}
