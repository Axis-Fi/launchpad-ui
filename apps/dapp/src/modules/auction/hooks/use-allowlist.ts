import {
  encodeAbiParameters,
  parseAbiParameters,
  formatUnits,
  parseUnits,
  toHex,
  zeroAddress,
  erc20Abi,
} from "viem";
import { UseQueryResult } from "@tanstack/react-query";
import { useAccount, useReadContract, useReadContracts } from "wagmi";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import {
  GetAuctionAllowlistQuery,
  useGetAuctionAllowlistQuery,
} from "@repo/subgraph-client/src/generated";
import { Auction, CallbacksType } from "@repo/types";
import { axisContracts, deployments } from "@repo/deployments";
import { fetchParams } from "utils/fetch";
import { getCallbacksType } from "../utils/get-callbacks-type";
import { isAllowlistCallback } from "../utils/auction-details";

export type AllowlistResult = {
  canBid: boolean;
  amountLimited: boolean;
  limit: bigint; // number of quote tokens as a formatted string
  criteria: string;
  callbackData: `0x${string}`;
};

export function useAllowlist(auction: Auction): AllowlistResult {
  // Load the currently connected wallet address
  const account = useAccount();
  const user = account.address ?? zeroAddress;

  // If the auction has a custom callback it could be an allowlist so give it the benefit of the doubt
  const callbacksType = getCallbacksType(auction);
  const isCustomCallback = callbacksType === CallbacksType.CUSTOM;
  const shouldFetchAllowList =
    isAllowlistCallback(callbacksType) || isCustomCallback;

  // Fetch allow list for this auction from the subgraph
  const {
    data: auctionWithAllowlist,
  }: UseQueryResult<GetAuctionAllowlistQuery> = useGetAuctionAllowlistQuery(
    {
      endpoint: deployments[auction.chainId!].subgraphURL,
      fetchParams,
    },
    { id: auction.id! },
    {
      enabled: !!auction?.chainId && !!auction?.id && shouldFetchAllowList,
    },
  );
  const allowlist =
    auctionWithAllowlist?.batchAuctionLot?.info?.allowlist.map(
      (list) => list.values,
    ) ?? [];

  // Check if the callback type is an allowlist, if not return default values
  const isMerkle =
    callbacksType === CallbacksType.MERKLE_ALLOWLIST ||
    callbacksType === CallbacksType.CAPPED_MERKLE_ALLOWLIST ||
    callbacksType === CallbacksType.ALLOCATED_MERKLE_ALLOWLIST;

  const hasLimit =
    callbacksType === CallbacksType.CAPPED_MERKLE_ALLOWLIST ||
    callbacksType === CallbacksType.ALLOCATED_MERKLE_ALLOWLIST;

  // Set default values for the return variables
  let canBid = false;
  let amountLimited = false;
  let limit = BigInt(0);
  let criteria = "";
  let callbackData = toHex("");

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

  const tokenContract = {
    address: tokenAddress,
    abi: erc20Abi,
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
    query: {
      select: (data) => data.map((r) => r.result) as [bigint, bigint, string],
      enabled: callbacksType === CallbacksType.TOKEN_ALLOWLIST,
    },
  });

  const [balance, decimals, symbol] = data ?? [BigInt(0), BigInt(0), ""];

  // Set values based on conditional logic

  // For merkle allowlists, we need to check if the user is on the allowlist
  if (isMerkle) {
    // Check if the account is on the allowlist
    canBid =
      allowlist
        .map((entry: string[]) => entry[0].toLowerCase() === user.toLowerCase())
        .reduce((acc: boolean, curr: boolean) => acc || curr, false) ?? false;

    criteria = "users that are on the allowlist provided by the seller";

    // Get the merkle proof and limit for the user if they can bid
    if (canBid) {
      // Handle conditional logic for the different allowlist types and set the callback data
      switch (callbacksType) {
        case CallbacksType.MERKLE_ALLOWLIST: {
          // Generate the proof for inclusion in callback data
          const tree = StandardMerkleTree.of(allowlist, ["address"]);
          const proof = tree.getProof([user]) as `0x${string}`[];
          callbackData = encodeAbiParameters(parseAbiParameters("bytes32[]"), [
            proof,
          ]);
          break;
        }
        case CallbacksType.CAPPED_MERKLE_ALLOWLIST: {
          // For capped allowlists, the user's limit is the global limit minus what they've already spent
          amountLimited = true;
          limit = (cap ?? BigInt(0)) - spent;

          // Generate the proof for inclusion in callback data
          const tree = StandardMerkleTree.of(allowlist, ["address"]);
          const proof = tree.getProof([user]) as `0x${string}`[];
          callbackData = encodeAbiParameters(parseAbiParameters("bytes32[]"), [
            proof,
          ]);
          break;
        }
        case CallbacksType.ALLOCATED_MERKLE_ALLOWLIST: {
          // For allocated allowlists, the user's limit is in the allowlist
          amountLimited = true;

          // Get the allocation and calculate their remaining limit from that
          const allocation =
            allowlist.find(
              (entry: string[]) =>
                entry[0].toLowerCase() === user?.toLowerCase(),
            )?.[1] ?? "0";
          limit = BigInt(allocation) - spent;

          // Generate the proof for inclusion in callback data
          const tree = StandardMerkleTree.of(allowlist, ["address", "uint256"]);
          const proof = tree.getProof([user, allocation]) as `0x${string}`[];
          callbackData = encodeAbiParameters(
            parseAbiParameters("bytes32[] proof,uint256 allocation"),
            [proof, BigInt(allocation)],
          );
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
      limit,
      criteria,
      callbackData,
    };
  }

  // For token allowlists, we need to check if the user has enough tokens to bid and set values
  if (callbacksType === CallbacksType.TOKEN_ALLOWLIST) {
    // Check if the user has enough tokens to bid
    canBid = balance >= threshold;

    criteria = `users that have at least ${formatUnits(
      threshold,
      Number(decimals),
    )} ${symbol} in their wallet`;

    return { canBid, amountLimited, limit: BigInt(0), criteria, callbackData };
  }

  // Auction is public and doesn't have an allowlist
  return {
    canBid: true,
    amountLimited,
    limit: BigInt(0),
    criteria,
    callbackData,
  };
}
