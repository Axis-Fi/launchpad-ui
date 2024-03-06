import { axisContracts } from "@repo/deployments";
import { useAllowance } from "loaders/use-allowance";
import { MaxAllowanceTransferAmount } from "permit2-sdk-viem";
import { invariant } from "utils/error";
import { Address } from "viem";
import {
  useAccount,
  useChainId,
  useReadContract,
  useSignTypedData,
} from "wagmi";

const THIRTY_MINUTES = 1000 * 60 * 60 * 30;
const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;

export function usePermit2(tokenAddress: Address, spenderAddress: Address) {
  const { address } = useAccount();
  const chainId = useChainId();
  const permit2Address = axisContracts.addresses[chainId].permit2;

  //Check if permit2 is approved for this token
  const permitAllowance = useAllowance({
    chainId,
    tokenAddress,
    ownerAddress: address,
    spenderAddress: permit2Address,
    amount: MaxAllowanceTransferAmount,
  });

  const isPermit2Approved =
    permitAllowance.currentAllowance === MaxAllowanceTransferAmount;

  //Get current permit status for the specified token
  const currentTokenAllowance = useReadContract({
    chainId,
    abi: axisContracts.abis.permit2,
    address: permit2Address,
    functionName: "allowance",
    args: [tokenAddress, address!, spenderAddress],
    query: { enabled: isPermit2Approved && !!address },
  });

  const sign = useSignTypedData();

  //
  const handleSignPermit = async (amount: bigint) => {
    invariant(currentTokenAllowance.data, "No permit2 allowance found");

    const [permitAmount, expiration, nonce] = currentTokenAllowance.data;

    invariant(
      permitAmount >= amount,
      `Insuffiecient Permit2 allowance for ${tokenAddress}`,
    );

    invariant(expiration > Date.now() / 1000, "Permit2 expired");

    const permitSingle: permit2.PermitSingle = {
      spender: spenderAddress,
      sigDeadline: BigInt(toDeadline(THIRTY_MINUTES)),
      details: {
        token: tokenAddress,
        amount,
        expiration: toDeadline(THIRTY_DAYS),
        nonce,
      },
    };

    const { domain, values, types } = permit2.AllowanceTransfer.getPermitData(
      permitSingle,
      permit2Address,
      chainId,
    );

    return sign.signTypedDataAsync({
      domain,
      values,
      types,
    });
  };

  return {
    isPermit2Approved,
    handleSignPermit,
  };
}

function toDeadline(expiration: number) {
  return Math.floor((Date.now() + expiration) / 1000);
}
