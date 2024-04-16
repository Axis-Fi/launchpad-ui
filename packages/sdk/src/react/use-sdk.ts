import { useContext } from "react";
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import { OriginSdk } from "..";
import { OriginSdkContext } from ".";

const useSdk = <TResult>(
  sdkCallback: (sdk: OriginSdk) => Promise<TResult>,
  options?: UseQueryOptions<TResult>,
): UseQueryResult<TResult> => {
  const sdk = useContext(OriginSdkContext);

  if (!sdk) {
    throw new Error("useSdk must be used within an <OriginSdkProvider/>");
  }

  const queryKey = options?.queryKey || [sdkCallback.name];

  return useQuery({
    ...options,
    queryKey,
    queryFn: () => sdkCallback(sdk),
  });
};

export { useSdk };

/* sample usage
const { data, error } = useSdk(async (sdk) => sdk.bid({ lotId: "123", amount: 100 }));
console.log(data, error)
*/
