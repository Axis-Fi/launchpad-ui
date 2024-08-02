import { getDuration, getTimestamp } from "utils/date";
import { toBasisPoints } from "utils/number";
import { getAddress, zeroAddress } from "viem";
import { CreateAuctionForm } from "pages/create-auction-page";

type BaseDtlOnCreateParams = Pick<
  CreateAuctionForm,
  | "dtlProceedsPercent"
  | "dtlVestingStart"
  | "dtlVestingDuration"
  | "dtlRecipient"
>;

/** Prepares onCreate parameters for BaseDirectToLiquidity */
export function prepareBaseDTL(values: BaseDtlOnCreateParams) {
  const proceedsUtilisationPercent = values.dtlProceedsPercent
    ? toBasisPoints(values.dtlProceedsPercent[0] ?? 0)
    : 0;

  const vestingStart = values.dtlVestingStart
    ? getTimestamp(values.dtlVestingStart)
    : 0;

  const vestingExpiry =
    vestingStart === 0
      ? 0
      : vestingStart + getDuration(Number(values.dtlVestingDuration ?? 0));

  const recipient = !values.dtlRecipient
    ? zeroAddress
    : getAddress(values.dtlRecipient);

  return {
    proceedsUtilisationPercent,
    vestingStart,
    vestingExpiry,
    recipient,
  };
}

export default {
  components: [
    {
      type: "uint24",
      name: "proceedsUtilisationPercent",
    },
    {
      type: "uint48",
      name: "vestingStart",
    },
    {
      type: "uint48",
      name: "vestingExpiry",
    },
    {
      type: "address",
      name: "recipient",
    },
    {
      type: "bytes",
      name: "implParams",
    },
  ],
  type: "tuple",
  name: "OnCreateParams",
};
