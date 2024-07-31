import { deployments } from "@repo/deployments";
import { callbackLabels, callbackMap } from "utils/contracts";
import { AxisCallbackNames, CallbacksType } from "@repo/types";

const defaultCallbacks = [
  {
    value: CallbacksType.NONE,
    label: "None",
  },
];

/** Parses deployments to generate callback select options */
export default function getExistingCallbacks(chainId: number) {
  const deployment = deployments[chainId];
  if (deployment.callbacks) {
    const callbacks = Object.entries(callbackMap)
      .filter(([, name]) => !!deployment.callbacks![name as AxisCallbackNames])
      .map(([type]) => {
        return {
          value: type,
          label: callbackLabels[type as CallbacksType],
        };
      });
    callbacks.unshift(defaultCallbacks[0]);
    return callbacks;
  }

  return defaultCallbacks;
}
