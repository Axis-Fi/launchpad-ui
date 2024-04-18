import { useContext } from "react";
import {
  useQuery,
  useMutation,
  type UseQueryOptions,
  type UseQueryResult,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";
import { OriginSdk } from "..";
import { OriginSdkContext } from ".";

/**
 * A hook for calling Origin SDK's read functions.
 *
 * @param callback A callback that receives the SDK instance and returns a promise.
 * @param options Options to pass to the underlying useQuery hook.
 * @returns The result of the SDK callback as a TanStack QueryResult.
 *
 * @example
 * const { data: auction, error, status } = useSdkQuery(
 *   sdk => sdk.getAuction({ lotId: lotId, chainId }),
 *   {
 *     queryKey: ["get-auction", lotId, chainId],
 *     enabled: !!lotId && !!chainId,
 *   }
 * );
 */
const useSdkQuery = <TResult>(
  callback: (sdk: OriginSdk) => Promise<TResult>,
  options?: UseQueryOptions<TResult>,
): UseQueryResult<TResult> => {
  const sdk = useContext(OriginSdkContext);

  if (!sdk) {
    throw new Error("useSdkQuery must be used within an <OriginSdkProvider/>");
  }

  // TODO: could proxy trap the callback and infer queryKey from callback args
  const queryKey = options?.queryKey || [callback.name];

  return useQuery({
    ...options,
    queryKey,
    queryFn: () => callback(sdk),
  });
};

/**
 * A hook for calling Origin SDK's side-effect functions.
 *
 * @param callback A callback that receives the SDK instance and returns a promise.
 * @param options Options to pass to the underlying useMutation hook.
 * @returns The result of the SDK callback as a TanStack MutationResult.
 *
 * @example
 * const bidMutation = useSdkMutation(sdk => sdk.bid({
 *   lotId: 1,
 *   amountIn: 100,
 *   amountOut: 10,
 *   chainId: 1,
 *   referrerAddress: "0x000...",
 *   bidderAddress: "0x000...",
 *   signedPermit2Approval: "0x000...",
 * }))
 */
const useSdkMutation = <TResult>(
  callback: (sdk: OriginSdk) => Promise<TResult>,
  options?: UseMutationOptions<TResult>,
): UseMutationResult<TResult, Error, void, unknown> => {
  const sdk = useContext(OriginSdkContext);

  if (!sdk) {
    throw new Error("useSdk must be used within an <OriginSdkProvider/>");
  }

  return useMutation({
    ...options,
    mutationFn: () => callback(sdk),
  });
};

/**
 * A hook for accessing the Origin SDK instance.
 *
 * @remarks Escape hatch for when the query and mutation hooks don't fit your use case.
 * @returns The Origin SDK instance.
 *
 * @example TODO
 */
const useSdk = (): OriginSdk => {
  const sdk = useContext(OriginSdkContext);

  if (!sdk) {
    throw new Error("useSdk must be used within an <OriginSdkProvider/>");
  }

  return sdk;
};

export { useSdkQuery, useSdkMutation, useSdk };
