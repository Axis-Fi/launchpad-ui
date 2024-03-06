const prefix = "Invariant";

//simple implementation of invariant
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export function invariant(condition?: any, message = ""): asserts condition {
  if (condition) return;

  throw new Error(`${prefix}: ${message}`);
}
