import { Auction, CallbacksType } from "@repo/types";
import { getCallbacksType } from "../utils/get-callbacks-type";
import { useAccount, useReadContract, useReadContracts } from "wagmi";
import { axisContracts } from "@repo/deployments";
import { formatUnits, parseUnits, zeroAddress } from "viem";

export type AllowlistResult = {
  canBid: boolean;
  amountLimited: boolean;
  limit: string; // number of quote tokens as a formatted string
  criteria: string;
};

export function useAllowlist(auction: Auction): AllowlistResult {
  // Load the currently connected wallet address
  const account = useAccount();
  const user = account.address ?? zeroAddress;

  // Check if the callback type is an allowlist, if not return default values
  const callbacksType = getCallbacksType(auction);

  const isMerkle =
    callbacksType === CallbacksType.MERKLE_ALLOWLIST ||
    callbacksType === CallbacksType.CAPPED_MERKLE_ALLOWLIST ||
    callbacksType === CallbacksType.ALLOCATED_MERKLE_ALLOWLIST;

  const hasLimit =
    callbacksType === CallbacksType.CAPPED_MERKLE_ALLOWLIST ||
    callbacksType === CallbacksType.ALLOCATED_MERKLE_ALLOWLIST;

  // Use hooks before conditional logic

  // Query the amount the user has already spent from the contract
  let { data: spent } = useReadContract({
    abi: axisContracts.abis.cappedMerkleAllowlist, // we can use this ABI for both capped and allocated allowlists since they have the same function signature
    address: auction.callbacks,
    functionName: "lotBuyerSpent",
    args: [parseUnits(auction.lotId, 0), user],
    query: { enabled: hasLimit },
  });
  spent = spent ?? BigInt(0);

  let amountLimited = false;
  let limit = BigInt(0);

  // For capped allowlists, the global per user limit is also on the contract
  const { data: cap } = useReadContract({
    abi: axisContracts.abis.cappedMerkleAllowlist,
    address: auction.callbacks,
    functionName: "lotBuyerLimit",
    args: [parseUnits(auction.lotId, 0)],
    query: {
      enabled: callbacksType === CallbacksType.CAPPED_MERKLE_ALLOWLIST,
    },
  });

  // Get the token contract and balance threshold from the callback contract
  const { data: callbackResponse } = useReadContract({
    abi: axisContracts.abis.tokenAllowlist,
    address: auction.callbacks,
    functionName: "lotChecks",
    args: [parseUnits(auction.lotId, 0)],
    query: { enabled: callbacksType === CallbacksType.TOKEN_ALLOWLIST },
  });
  const [tokenAddress, threshold] = callbackResponse ?? [
    zeroAddress,
    BigInt(0),
  ];

  // Check if the user has enough tokens to bid and get info about the token
  const abi = [
    {
      type: "function",
      name: "balanceOf",
      stateMutability: "view",
      inputs: [{ name: "account", type: "address" }],
      outputs: [{ type: "uint256" }],
    },
    {
      type: "function",
      name: "decimals",
      stateMutability: "view",
      inputs: [],
      outputs: [{ type: "uint8" }],
    },
    {
      type: "function",
      name: "symbol",
      stateMutability: "view",
      inputs: [],
      outputs: [{ type: "string" }],
    },
  ];
  const tokenContract = {
    address: tokenAddress,
    abi,
  };
  const { data } = useReadContracts({
    contracts: [
      {
        ...tokenContract,
        functionName: "balanceOf",
        args: [user],
      },
      {
        ...tokenContract,
        functionName: "decimals",
      },
      {
        ...tokenContract,
        functionName: "symbol",
      },
    ],
    query: { enabled: callbacksType === CallbacksType.TOKEN_ALLOWLIST },
  });
  // TODO: help with TS types here
  const [balance, decimals, symbol] = (data as unknown as [
    bigint,
    bigint,
    string,
  ]) || [BigInt(0), BigInt(0), ""];

  // Set values based on conditional logic

  // For merkle allowlists, we need to check if the user is on the allowlist
  if (isMerkle) {
    // Check if the account is on the allowlist
    const canBid =
      auction.auctionInfo?.allowlist
        ?.map(
          (entry: string[]) => entry[0].toLowerCase() === user.toLowerCase(),
        )
        .reduce((acc: boolean, curr: boolean) => acc || curr, false) ?? false;

    const criteria = "users that are on the allowlist provided by the seller";

    // Check if the allowlist enforces a spend limit and set values if so
    if (hasLimit) {
      amountLimited = true;

      switch (callbacksType) {
        case CallbacksType.CAPPED_MERKLE_ALLOWLIST: {
          limit = (cap ?? BigInt(0)) - spent;
          break;
        }
        case CallbacksType.ALLOCATED_MERKLE_ALLOWLIST: {
          // For allocated allowlists, the user's limit is in the allowlist
          const allocation =
            auction.auctionInfo?.allowlist?.find(
              (entry: string[]) =>
                entry[0].toLowerCase() === user?.toLowerCase(),
            )?.[1] ?? "0";
          limit = parseUnits(allocation, auction.quoteToken.decimals) - spent;
          break;
        }
        default: {
          // This should never happen
          break;
        }
      }
    }

    return {
      canBid,
      amountLimited,
      limit: formatUnits(limit, auction.quoteToken.decimals),
      criteria,
    };
  }

  // For token allowlists, we need to check if the user has enough tokens to bid and set values
  if (callbacksType === CallbacksType.TOKEN_ALLOWLIST) {
    // Check if the user has enough tokens to bid
    const canBid = balance >= threshold;

    const criteria = `users that have at least ${formatUnits(
      threshold,
      Number(decimals),
    )} ${symbol} in their wallet`;

    return { canBid, amountLimited: false, limit: "0", criteria };
  }

  // Auction is public and doesn't have an allowlist
  return { canBid: true, amountLimited: false, limit: "0", criteria: "" };
}
