import { encodeAbiParameters } from "viem";

export function getLinearVestingParams(params: {
  start: number;
  expiry: number;
}) {
  return encodeAbiParameters(
    [
      {
        name: "VestingParams",
        type: "tuple",
        components: [
          { name: "start", type: "uint48" },
          { name: "expiry", type: "uint48" },
        ],
      },
    ],
    [params],
  );
}
