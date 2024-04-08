import type { LinearVestingData } from "@repo/types";
import { dateHelpers } from "utils/date";
import { Hex, decodeAbiParameters, encodeAbiParameters } from "viem";

const VestingParamsAbiType = [
  {
    name: "VestingParams",
    type: "tuple",
    components: [
      { name: "start", type: "uint48" },
      { name: "expiry", type: "uint48" },
    ],
  },
] as const;

type VestingParams = {
  start: number;
  expiry: number;
};

export function getLinearVestingParams(params: VestingParams) {
  return encodeAbiParameters(VestingParamsAbiType, [params]);
}

export function decodeLinearVestingParams(data: Hex): LinearVestingData {
  const [{ start, expiry }] = decodeAbiParameters<typeof VestingParamsAbiType>(
    VestingParamsAbiType,
    data,
  );

  const startDate = new Date(start * 1000);
  const expiryDate = new Date(expiry * 1000);
  const duration = dateHelpers.intervalToDuration(startDate, expiryDate);
  const durationFromNow = dateHelpers.intervalToDuration(
    Date.now(),
    expiryDate,
  );

  const isVestingExpired = dateHelpers.isAfter(Date.now(), expiryDate);

  return {
    start,
    expiry,
    startDate,
    expiryDate,
    isVestingExpired,
    days: duration.days!,
    daysFromNow: durationFromNow.days!,
  };
}
