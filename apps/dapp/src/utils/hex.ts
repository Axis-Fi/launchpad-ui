import { Hex, fromHex, isHex, toHex } from "viem";

export function toKeycode(keycode: string): Hex {
  return toHex(keycode, { size: 5 });
}

export function fromVeecode(keycode: string): string {
  if (!isHex(keycode)) {
    throw new Error("Non Hex value provided to decode");
  }

  return fromHex(keycode, "string");
}
