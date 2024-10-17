import { useQueryClient } from "@tanstack/react-query";
import {
  Text,
  Button,
  DatePicker,
  DialogContent,
  DialogHeader,
  DialogInput,
  DialogRoot,
  DialogTitle,
  Form,
  FormField,
  FormItemWrapper,
  Input,
  Label,
  Select,
  Switch,
  Textarea,
  PercentageSlider,
  trimAddress,
  Tooltip,
} from "@repo/ui";
import { abis } from "@repo/abis";
import { DevTool } from "@hookform/devtools";

import { TokenPicker } from "modules/token/token-picker";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cloakClient } from "@repo/cloak";
import {
  UseWaitForTransactionReceiptReturnType,
  useAccount,
  useChainId,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import {
  Address,
  encodeAbiParameters,
  formatUnits,
  fromHex,
  getAddress,
  isAddress,
  isHex,
  parseAbiParameters,
  parseUnits,
  toHex,
  zeroAddress,
} from "viem";
import {
  getDuration,
  getTimestamp,
  formatDate,
  dateMath,
  trimCurrency,
  toBasisPoints,
  getScaledCapacityWithCuratorFee,
} from "src/utils";

import { AuctionType, CallbacksType, isBaselineCallback } from "@repo/types";

import { storeAuctionInfo } from "modules/auction/hooks/use-auction-info";
import { addDays, addHours, addMinutes } from "date-fns";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import { AuctionCreationStatus } from "modules/auction/auction-creation-status";
import { useAllowance } from "loaders/use-allowance";
import { toKeycode } from "utils/hex";
import { TokenSelectDialog } from "modules/token/token-select-dialog";
import { getAuctionCreateParams } from "modules/auction/utils/get-auction-create-params";
import { RequiresChain } from "components/requires-chain";
import { getLinearVestingParams } from "modules/auction/utils/get-derivative-params";
import { useNavigate } from "react-router-dom";
import {
  callbackLabels,
  getAuctionHouse,
  getLatestCallback,
} from "utils/contracts";
import Papa from "papaparse";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { PageContainer } from "modules/app/page-container";
import { PageHeader } from "modules/app/page-header";
import useERC20Balance from "loaders/use-erc20-balance";
import { CreateAuctionPreview } from "./create-auction-preview";
import type { AuctionInfoWriteType } from "@repo/ipfs-api/src/types";
import { useFees } from "modules/auction/hooks/use-fees";
import { getAuctionsQueryKey } from "modules/auction/hooks/use-auctions";
import type { GetAuctionLotsQuery } from "@repo/subgraph-client";
import { getAuctionId } from "modules/auction/utils/get-auction-id";
import {
  auctions as auctionsCache,
  auction as auctionCache,
  optimisticUpdate,
} from "modules/auction/utils/optimistic";
import { getAuctionQueryKey } from "modules/auction/hooks/use-auction";
import { useGetCuratorFee } from "modules/auction/hooks/use-get-curator-fee";
import { getAuctionPath } from "utils/router";
import getExistingCallbacks from "modules/create-auction/get-existing-callbacks";
import { useStoredAuctionConfig } from "state/auction-config";
import type { Token } from "@repo/types";
import { DownloadIcon, ShareIcon, TrashIcon } from "lucide-react";
import { TriggerMessage } from "components/trigger-message";

const optionalURL = z.union([z.string().url().optional(), z.literal("")]);

const tokenSchema = z.object({
  address: z.string().regex(/^(0x)?[0-9a-fA-F]{40}$/, "Invalid address"),
  chainId: z.coerce.number(),
  decimals: z.coerce.number(),
  symbol: z.string(),
  logoURI: optionalURL,
  totalSupply: z.string().optional(),
});

const StringNumberNotNegative = z
  .string()
  .regex(/^[^-].*/, "Number must not start with '-'");

const schema = z
  .object({
    quoteToken: tokenSchema,
    payoutToken: tokenSchema.extend({
      logoURI: z.string().url(),
    }),
    payoutTokenBalance: z.string().optional(),
    capacity: z.string(),
    auctionType: z.string(),
    minFillPercent: z.array(z.number()).optional(),
    minBidSize: z.string().optional(),
    minPrice: StringNumberNotNegative.optional(),
    price: StringNumberNotNegative.optional(),
    start: z.date(),
    deadline: z.date(),
    callbacksType: z.string().optional(),
    callbacks: z
      .string()
      .regex(/^(0x)?[0-9a-fA-F]{40}$/)
      .optional(),
    allowlist: z.array(z.array(z.string())).optional(),
    cappedAllowlistLimit: z.string().optional(),
    allowlistToken: tokenSchema.optional(),
    allowlistTokenThreshold: z.string().optional(),
    dtlProceedsPercent: z.array(z.number()).optional(),
    dtlIsVested: z.boolean().optional(),
    dtlVestingStart: z.date().optional(),
    dtlVestingDuration: StringNumberNotNegative.optional(),
    dtlRecipient: z
      .string()
      .regex(/^(0x)?[0-9a-fA-F]{40}$/)
      .optional(),
    dtlUniV3PoolFee: z.string().optional(),
    baselineFloorReservesPercent: z.array(z.number()).optional(),
    baselineFloorRangeGap: StringNumberNotNegative.optional(),
    baselineAnchorTickWidth: StringNumberNotNegative.optional(),
    baselineAnchorTickU: z.string().optional(),
    baselinePoolTargetTick: z.string().optional(),
    customCallbackData: z
      .string()
      .regex(/^(0x)?[0-9a-fA-F]$/)
      .optional(),
    isVested: z.boolean().optional(),
    curator: z
      .string()
      .regex(/^(0x)?[0-9a-fA-F]{40}$/)
      .optional(),
    vestingDuration: StringNumberNotNegative.optional(),
    vestingStart: z.date().optional(),
    referrerFee: z.array(z.number()).optional(),
    // Metadata
    name: z.string().max(32),
    description: z.string().max(332),
    tagline: z.string().max(42),
    projectLogo: z.string().url().optional(),
    projectBanner: z.string().url(),
    twitter: optionalURL,
    discord: optionalURL,
    website: optionalURL,
    farcaster: optionalURL,
  })
  .refine((data) => (!data.isVested ? true : data.vestingDuration), {
    message: "Vesting duration is required",
    path: ["vestingDuration"],
  })

  // TODO do we need to add a max vesting duration check?
  // .refine(
  //   (data) => (!data.isVested ? true : data.vestingDuration && Number(data.vestingDuration) <= 270),
  //   {
  //     message: "Max vesting duration is 270 days",
  //     path: ["vestingStart"],
  //   },
  // )
  .refine((data) => (!data.isVested ? true : data.vestingStart), {
    message: "Vesting start is required",
    path: ["vestingStart"],
  })
  .refine(
    (data) =>
      !data.isVested
        ? true
        : data.vestingStart &&
          data.vestingStart.getTime() >= data.deadline.getTime(),
    {
      message: "Vesting start needs to be on or after the auction deadline",
      path: ["vestingStart"],
    },
  )
  .refine((data) => data.start.getTime() > new Date().getTime(), {
    message: "Start date needs to be in the future",
    path: ["start"],
  })
  .refine(
    (data) => addDays(data.start, 1).getTime() < data.deadline.getTime(),
    {
      message: "Deadline needs to be at least 1 day after the start",
      path: ["deadline"],
    },
  )
  .refine(
    (data) =>
      // Only required for EMP
      data.auctionType === AuctionType.SEALED_BID
        ? !!data.minPrice && isFinite(Number(data.minPrice))
        : true,
    {
      message: "Minimum Price must be set",
      path: ["minPrice"],
    },
  )
  .refine(
    (data) =>
      // Only required for FPB
      data.auctionType === AuctionType.FIXED_PRICE_BATCH
        ? !!data.price && isFinite(Number(data.price))
        : true,
    {
      message: "Price must be set",
      path: ["price"],
    },
  )
  .refine(
    (data) =>
      // Only required for EMP
      data.auctionType === AuctionType.SEALED_BID
        ? !!data.minBidSize && isFinite(Number(data.minBidSize[0]))
        : true,
    {
      message: "Minimum bid size must be set",
      path: ["minBidSize"],
    },
  )
  .refine(
    (data) =>
      // Only required for FPB and EMP
      data.auctionType === AuctionType.FIXED_PRICE_BATCH ||
      data.auctionType === AuctionType.SEALED_BID
        ? !!data.minFillPercent && isFinite(Number(data.minFillPercent[0]))
        : true,
    {
      message: "Minimum filled percentage must be set",
      path: ["minFillPercent"],
    },
  )
  .refine(
    (data) =>
      !data.dtlIsVested
        ? true
        : data.dtlVestingStart &&
          data.dtlVestingStart.getTime() >= data.deadline.getTime(),
    {
      message:
        "Liquidity vesting start needs to be on or after the auction deadline",
      path: ["dtlVestingStart"],
    },
  )
  .refine((data) => (!data.dtlIsVested ? true : data.dtlVestingDuration), {
    message: "Liquidity vesting duration is required",
    path: ["dtlVestingDuration"],
  })
  .refine(
    (data) =>
      !(
        data.callbacksType === CallbacksType.UNIV2_DTL ||
        data.callbacksType === CallbacksType.UNIV3_DTL
      )
        ? true
        : data.dtlRecipient,
    {
      message: "Liquidity recipient is required",
      path: ["dtlRecipient"],
    },
  )
  .refine(
    (data) =>
      !(
        data.callbacksType === CallbacksType.UNIV2_DTL ||
        data.callbacksType === CallbacksType.UNIV3_DTL
      )
        ? true
        : data.dtlProceedsPercent &&
          data.dtlProceedsPercent.length > 0 &&
          data.dtlProceedsPercent[0] >= 1 &&
          data.dtlProceedsPercent[0] <= 100,
    {
      message: "Liquidity proceeds percent must be 1-100",
      path: ["dtlProceedsPercent"],
    },
  )
  .refine(
    (data) =>
      !isBaselineCallback(data.callbacksType)
        ? true
        : data.dtlProceedsPercent &&
          data.dtlProceedsPercent.length > 0 &&
          data.dtlProceedsPercent[0] >= 1 &&
          data.dtlProceedsPercent[0] <= 100,
    {
      message: "Liquidity proceeds percent must be 1-100",
      path: ["dtlProceedsPercent"],
    },
  )
  .refine(
    (data) =>
      !isBaselineCallback(data.callbacksType)
        ? true
        : data.callbacks !== undefined && isAddress(data.callbacks),
    {
      message:
        "Callbacks address must be specified for Baseline callbacks type",
      path: ["callbacks"],
    },
  )
  .refine(
    (data) => {
      return !isBaselineCallback(data.callbacksType)
        ? true
        : data.baselineFloorReservesPercent &&
            data.baselineFloorReservesPercent.length > 0 &&
            data.baselineFloorReservesPercent[0] >= 10 &&
            data.baselineFloorReservesPercent[0] <= 100;
    },
    {
      message: "Floor reserves percent must be 10-100",
      path: ["baselineFloorReservesPercent"],
    },
  )
  .refine(
    (data) =>
      !isBaselineCallback(data.callbacksType)
        ? true
        : data.baselineFloorRangeGap && Number(data.baselineFloorRangeGap) >= 0,
    {
      message: "Floor range gap must be a positive number",
      path: ["baselineFloorRangeGap"],
    },
  )
  .refine(
    (data) =>
      !isBaselineCallback(data.callbacksType)
        ? true
        : data.baselineAnchorTickWidth &&
          Number(data.baselineAnchorTickWidth) >= 1 &&
          Number(data.baselineAnchorTickWidth) <= 50,
    {
      message: "Anchor tick width must be 10-50",
      path: ["baselineAnchorTickWidth"],
    },
  )
  .refine(
    (data) =>
      !isBaselineCallback(data.callbacksType)
        ? true
        : data.baselinePoolTargetTick &&
          Number(data.baselinePoolTargetTick) <=
            Number(data.baselineAnchorTickU),
    {
      message:
        "Pool target tick must be less than or equal to upper anchor tick",
      path: ["baselinePoolTargetTick"],
    },
  )
  .refine(
    (data) =>
      !isSimpleAllowlist(data.callbacksType) &&
      !isCappedAllowlist(data.callbacksType) &&
      !isAllocatedAllowlist(data.callbacksType)
        ? true
        : data.allowlist !== undefined,
    {
      message: "Allowlist must be set",
      path: ["allowlist"],
    },
  )
  .refine(
    (data) =>
      !isTokenAllowlist(data.callbacksType)
        ? true
        : data.allowlistToken && isAddress(data.allowlistToken.address),
    {
      message: "Allowlist token must be a valid address",
      path: ["allowlistToken"],
    },
  )
  .refine(
    (data) =>
      !isTokenAllowlist(data.callbacksType)
        ? true
        : data.allowlistTokenThreshold &&
          Number(data.allowlistTokenThreshold) >= 0,
    {
      message: "Allowlist token threshold must be a positive number",
      path: ["allowlistTokenThreshold"],
    },
  )
  .refine(
    (data) =>
      !(data.callbacksType === CallbacksType.UNIV3_DTL)
        ? true
        : data.dtlUniV3PoolFee,
    {
      message: "UniV3 pool fee is required",
      path: ["dtlUniV3PoolFee"],
    },
  )
  .refine(
    (data) =>
      // Baseline callbacks will supply the payout token
      // TODO determine this from the flags embedded in the contract address
      isBaselineCallback(data.callbacksType)
        ? true
        : Number(data.payoutTokenBalance) >= Number(data.capacity),
    {
      message: "Insufficient balance",
      path: ["capacity"],
    },
  );

export type CreateAuctionForm = z.infer<typeof schema>;

const generateAllowlistCallbackData = (
  values: CreateAuctionForm,
): `0x${string}` => {
  const allowlistTree =
    values.allowlist && StandardMerkleTree.of(values.allowlist, ["address"]);
  const root = (allowlistTree?.root ?? "0x") as `0x${string}`;
  return encodeAbiParameters(parseAbiParameters("bytes32 merkleRoot"), [root]);
};

const generateCappedAllowlistCallbackData = (
  values: CreateAuctionForm,
): `0x${string}` => {
  const cap = parseUnits(
    values.cappedAllowlistLimit ?? "0",
    values.quoteToken.decimals,
  );
  const allowlistTree =
    values.allowlist && StandardMerkleTree.of(values.allowlist, ["address"]);
  const root = (allowlistTree?.root ?? "0x") as `0x${string}`;
  return encodeAbiParameters(
    parseAbiParameters("bytes32 merkleRoot, uint256 cap"),
    [root, cap],
  );
};

const generateAllocatedAllowlistCallbackData = (
  values: CreateAuctionForm,
): `0x${string}` => {
  const allowlistTree =
    values.allowlist &&
    StandardMerkleTree.of(values.allowlist, ["address", "uint256"]);
  const root = (allowlistTree?.root ?? "0x") as `0x${string}`;
  return encodeAbiParameters(parseAbiParameters("bytes32 merkleRoot"), [root]);
};

const generateTokenAllowlistCallbackData = (
  values: CreateAuctionForm,
): `0x${string}` => {
  const allowlistToken = (values.allowlistToken?.address ??
    zeroAddress) as `0x${string}`;
  const threshold = parseUnits(
    values.allowlistTokenThreshold ?? "0",
    values.allowlistToken?.decimals ?? 0,
  );
  return encodeAbiParameters(
    parseAbiParameters("address token, uint256 threshold"),
    [allowlistToken, threshold],
  );
};

const generateBaselineCallbackData = (
  type: CallbacksType,
  values: CreateAuctionForm,
): `0x${string}` => {
  const recipient = (values.dtlRecipient ?? zeroAddress) as `0x${string}`;
  const poolPercent = values.dtlProceedsPercent
    ? toBasisPoints(values.dtlProceedsPercent[0] ?? 0)
    : 0;
  const floorReservesPercent = values.baselineFloorReservesPercent
    ? toBasisPoints(values.baselineFloorReservesPercent[0] ?? 0)
    : 0;
  const floorRangeGap = Number(values.baselineFloorRangeGap ?? 0);
  const anchorTickU = Number(values.baselineAnchorTickU ?? 0);
  const anchorTickWidth = Number(values.baselineAnchorTickWidth ?? 0);
  const poolTargetTick = Number(values.baselinePoolTargetTick ?? 0);
  let allowlistParams = toHex("");

  if (type === CallbacksType.BASELINE_ALLOWLIST) {
    allowlistParams = generateAllowlistCallbackData(values);
  } else if (type === CallbacksType.BASELINE_ALLOCATED_ALLOWLIST) {
    allowlistParams = generateAllocatedAllowlistCallbackData(values);
  } else if (type === CallbacksType.BASELINE_CAPPED_ALLOWLIST) {
    allowlistParams = generateCappedAllowlistCallbackData(values);
  } else if (type === CallbacksType.BASELINE_TOKEN_ALLOWLIST) {
    allowlistParams = generateTokenAllowlistCallbackData(values);
  }

  return encodeAbiParameters(
    [
      {
        components: [
          {
            type: "address",
            name: "recipient",
          },
          {
            type: "uint24",
            name: "poolPercent",
          },
          {
            type: "uint24",
            name: "floorReservesPercent",
          },
          {
            type: "int24",
            name: "floorRangeGap",
          },
          {
            type: "int24",
            name: "anchorTickU",
          },
          {
            type: "int24",
            name: "anchorTickWidth",
          },
          {
            type: "int24",
            name: "poolTargetTick",
          },
          {
            type: "bytes",
            name: "allowlistParams",
          },
        ],
        type: "tuple",
        name: "CreateData",
      },
    ],
    [
      {
        recipient: recipient,
        poolPercent: poolPercent,
        floorReservesPercent: floorReservesPercent,
        floorRangeGap: floorRangeGap,
        anchorTickU: anchorTickU,
        anchorTickWidth: anchorTickWidth,
        poolTargetTick: poolTargetTick,
        allowlistParams: allowlistParams,
      },
    ],
  );
};

const isSimpleAllowlist = (callbacksType?: string) => {
  return (
    callbacksType === CallbacksType.MERKLE_ALLOWLIST ||
    callbacksType === CallbacksType.BASELINE_ALLOWLIST
  );
};

const isCappedAllowlist = (callbacksType?: string) => {
  return (
    callbacksType === CallbacksType.CAPPED_MERKLE_ALLOWLIST ||
    callbacksType === CallbacksType.BASELINE_CAPPED_ALLOWLIST
  );
};

const isAllocatedAllowlist = (callbacksType?: string) => {
  return (
    callbacksType === CallbacksType.ALLOCATED_MERKLE_ALLOWLIST ||
    callbacksType === CallbacksType.BASELINE_ALLOCATED_ALLOWLIST
  );
};

const isTokenAllowlist = (callbacksType?: string) => {
  return (
    callbacksType === CallbacksType.TOKEN_ALLOWLIST ||
    callbacksType === CallbacksType.BASELINE_TOKEN_ALLOWLIST
  );
};

export default function CreateAuctionPage() {
  // Due to components being uncontrolled the form inputs wont clear
  // after calling form.reset() so we have to force it
  const [resetKey, setResetKey] = React.useState(0);

  const navigate = useNavigate();
  const auctionDefaultValues = {
    minFillPercent: [50],
    auctionType: AuctionType.SEALED_BID,
    start: dateMath.addMinutes(new Date(), 15),
    dtlProceedsPercent: [100],
    baselineFloorReservesPercent: [50],
    baselineFloorRangeGap: "0",
    baselineAnchorTickU: "0",
    baselineAnchorTickWidth: "10",
  };

  const { address } = useAccount();
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  const [isTxDialogOpen, setIsTxDialogOpen] = React.useState(false);
  const connectedChainId = useChainId();
  const { chain } = useAccount();

  const [storedConfig, setStoredConfig] = useStoredAuctionConfig();

  const form = useForm<CreateAuctionForm>({
    resolver: zodResolver(schema),
    mode: "onChange",
    delayError: 600,
    defaultValues: storedConfig ?? auctionDefaultValues,
  });

  React.useEffect(() => {
    if (storedConfig) {
      updateForm(storedConfig);
    }
  }, [storedConfig]);

  React.useEffect(() => {
    const params = new URLSearchParams(location.hash.split("?")[1]);
    const data = params.get("data");
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        updateForm(parsedData);
      } catch (error) {
        console.error("Invalid JSON in query params:", error);
      }
    }
  }, [location.search]);

  function updateForm(data: Partial<CreateAuctionForm>) {
    const formatted = formatDates(clearNullishFields(data));
    Object.entries(formatted).forEach(([key, value]) =>
      form.setValue(key as keyof CreateAuctionForm, value),
    );
  }

  const [
    isVested,
    payoutToken,
    quoteToken,
    _chainId,
    capacity,
    _auctionType,
    callbacksType,
    dtlIsVested,
    dtlUniV3PoolFee,
    start,
    deadline,
    minBidSize,
    minPrice,
    curator,
  ] = form.watch([
    "isVested",
    "payoutToken",
    "quoteToken",
    "quoteToken.chainId",
    "capacity",
    "auctionType",
    "callbacksType",
    "dtlIsVested",
    "dtlUniV3PoolFee",
    "start",
    "deadline",
    "minBidSize",
    "minPrice",
    "curator",
  ]);

  const chainId = _chainId ?? connectedChainId;

  const auctionType = _auctionType as AuctionType;

  const { address: auctionHouseAddress, abi: auctionHouseAbi } =
    getAuctionHouse({
      auctionType,
      chainId,
    });

  const { data: fees } = useFees(
    connectedChainId,
    auctionHouseAddress,
    auctionType,
  );

  const { data: curatorFee } = useGetCuratorFee(
    chainId,
    auctionType,
    curator as Address,
  );

  const queryClient = useQueryClient();

  const createAuctionTx = useWriteContract();

  const createTxReceipt = useWaitForTransactionReceipt({
    hash: createAuctionTx.data,
  });

  const lotId = getCreatedAuctionId(createTxReceipt.data);

  const auctionInfoMutation = useMutation({
    mutationFn: async (values: CreateAuctionForm) => {
      const auctionInfo: AuctionInfoWriteType = {
        key: `${values.auctionType}-${values.payoutToken.chainId}_${
          values.payoutToken.address
        }_${values.start.getTime()}`,
        name: values.name,
        tagline: values.tagline,
        description: values.description,
        allowlist: values.allowlist,
        links: {
          projectLogo: values.projectLogo,
          payoutTokenLogo: values.payoutToken.logoURI,
          projectBanner: values.projectBanner,
          website: values.website,
          twitter: values.twitter,
          discord: values.discord,
          farcaster: values.farcaster,
        },
      };

      // Store the auction info
      const auctionInfoAddress = await storeAuctionInfo(auctionInfo);

      if (!auctionInfoAddress) throw new Error("Unable to store info on IPFS");

      return auctionInfoAddress.hashV0;
    },
    onError: (error) => console.error("Error during submission:", error),
  });

  const generateKeyPairMutation = useMutation({
    mutationFn: async () => {
      const publicKey = await cloakClient.keysApi.newKeyPairPost();

      if (!isHex(publicKey.x) || !isHex(publicKey.y)) {
        throw new Error("Public key is not in hex");
      }

      const updatedKey = {
        x: fromHex(publicKey.x, "bigint"),
        y: fromHex(publicKey.y, "bigint"),
      };

      return updatedKey;
    },
    onError: (error) => console.error("Error during submission:", error),
  });

  const creationHandler = async (values: CreateAuctionForm) => {
    const auctionInfoAddress = await auctionInfoMutation.mutateAsync(values);
    const auctionType = values.auctionType as AuctionType;
    const isEMP = auctionType === AuctionType.SEALED_BID;
    const isFPB = auctionType === AuctionType.FIXED_PRICE_BATCH;
    const code = isEMP ? "EMPA" : isFPB ? "FPBA" : "unknown";

    const auctionTypeKeycode = toKeycode(code);

    const publicKey = isEMP
      ? await generateKeyPairMutation.mutateAsync()
      : undefined;

    const auctionSpecificParams = getAuctionCreateParams(
      auctionType,
      values,
      publicKey,
    );

    // Callbacks
    const callbacksType = values.callbacksType as CallbacksType;

    // Set the callbacks address
    let callbacks;

    // Two main cases:
    // 1. No callback or custom callback
    // 2. Selected one of our standard callbacks
    if (
      values.callbacksType === undefined ||
      values.callbacksType === CallbacksType.CUSTOM ||
      values.callbacksType === CallbacksType.NONE
    ) {
      callbacks = values.callbacks ? getAddress(values.callbacks) : zeroAddress;
    } else {
      callbacks = getLatestCallback(chainId, callbacksType).address;
    }

    // Set the callback data based on the type and user inputs
    let callbackData = toHex("");

    switch (callbacksType) {
      case CallbacksType.NONE: {
        callbackData = toHex("");
        break;
      }
      case CallbacksType.CUSTOM: {
        callbackData = toHex(values.customCallbackData ?? "");
        break;
      }
      case CallbacksType.MERKLE_ALLOWLIST: {
        // TODO need to handle errors here? May not be necessary since we are validating the file format
        callbackData = generateAllowlistCallbackData(values);
        break;
      }
      case CallbacksType.CAPPED_MERKLE_ALLOWLIST: {
        callbackData = generateCappedAllowlistCallbackData(values);
        break;
      }
      case CallbacksType.ALLOCATED_MERKLE_ALLOWLIST: {
        // TODO need to handle errors here? May not be necessary since we are validating the file format
        callbackData = generateAllocatedAllowlistCallbackData(values);
        break;
      }
      case CallbacksType.TOKEN_ALLOWLIST: {
        callbackData = generateTokenAllowlistCallbackData(values);
        break;
      }
      case CallbacksType.UNIV2_DTL: {
        const proceedsPercent = values.dtlProceedsPercent
          ? toBasisPoints(values.dtlProceedsPercent[0] ?? 0)
          : 0;
        const vestingStart = values.dtlVestingStart
          ? getTimestamp(values.dtlVestingStart)
          : 0;
        const vestingExpiry =
          vestingStart === 0
            ? 0
            : vestingStart +
              getDuration(Number(values.dtlVestingDuration ?? 0));
        const recipient = !values.dtlRecipient
          ? zeroAddress
          : getAddress(values.dtlRecipient);
        const implParams = toHex("");
        callbackData = encodeAbiParameters(
          [
            {
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
            },
          ],
          [
            {
              proceedsUtilisationPercent: proceedsPercent,
              vestingStart: vestingStart,
              vestingExpiry: vestingExpiry,
              recipient: recipient,
              implParams: implParams,
            },
          ],
        );
        break;
      }
      case CallbacksType.UNIV3_DTL: {
        const proceedsPercent = values.dtlProceedsPercent
          ? toBasisPoints(values.dtlProceedsPercent[0] ?? 0)
          : 0;
        const vestingStart = values.dtlVestingStart
          ? getTimestamp(values.dtlVestingStart)
          : 0;
        const vestingExpiry =
          vestingStart === 0
            ? 0
            : vestingStart +
              getDuration(Number(values.dtlVestingDuration ?? 0));
        const recipient = (values.dtlRecipient ?? zeroAddress) as `0x${string}`;
        const poolFee = values.dtlUniV3PoolFee
          ? Number(values.dtlUniV3PoolFee)
          : 0;
        const implParams = encodeAbiParameters(
          parseAbiParameters("uint24 poolFee"),
          [poolFee],
        );

        callbackData = encodeAbiParameters(
          [
            {
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
            },
          ],
          [
            {
              proceedsUtilisationPercent: proceedsPercent,
              vestingStart: vestingStart,
              vestingExpiry: vestingExpiry,
              recipient: recipient,
              implParams: implParams,
            },
          ],
        );
        break;
      }
      case CallbacksType.BASELINE: {
        callbackData = generateBaselineCallbackData(callbacksType, values);
        break;
      }
      case CallbacksType.BASELINE_ALLOWLIST: {
        callbackData = generateBaselineCallbackData(callbacksType, values);
        break;
      }
      case CallbacksType.BASELINE_CAPPED_ALLOWLIST: {
        callbackData = generateBaselineCallbackData(callbacksType, values);
        break;
      }
      case CallbacksType.BASELINE_TOKEN_ALLOWLIST: {
        callbackData = generateBaselineCallbackData(callbacksType, values);
        break;
      }
      case CallbacksType.BASELINE_ALLOCATED_ALLOWLIST: {
        callbackData = generateBaselineCallbackData(callbacksType, values);
        break;
      }
    }

    createAuctionTx.writeContract(
      {
        abi: auctionHouseAbi,
        address: auctionHouseAddress,
        functionName: "auction",
        args: [
          {
            auctionType: auctionTypeKeycode,
            baseToken: getAddress(values.payoutToken.address),
            quoteToken: getAddress(values.quoteToken.address),
            curator: !values.curator ? zeroAddress : getAddress(values.curator),
            callbacks: callbacks,
            //TODO: Extract into derivative helper function
            derivativeType: !values.isVested ? toKeycode("") : toKeycode("LIV"),
            derivativeParams:
              !values.isVested || !values.vestingDuration
                ? toHex("")
                : getLinearVestingParams({
                    expiry:
                      getTimestamp(values.vestingStart ?? values.start) +
                      getDuration(Number(values.vestingDuration)),
                    start: getTimestamp(values.vestingStart ?? values.start),
                  }),
            wrapDerivative: false,
            callbackData: callbackData,
            referrerFee: toBasisPoints(values.referrerFee?.[0] ?? 0),
          },
          {
            start: getTimestamp(values.start),
            duration:
              getTimestamp(values.deadline) - getTimestamp(values.start),
            capacityInQuote: false, // Batch auctions do not allow capacity in quote
            capacity: parseUnits(values.capacity, values.payoutToken.decimals),
            implParams: auctionSpecificParams,
          },
          auctionInfoAddress,
        ],
      },
      {
        onError: (error) => console.error("Error during submission:", error),
      },
    );
  };

  /// AuctionHouse allowance
  const {
    isSufficientAllowance: isSufficientAuctionHouseAllowance,
    execute: executeApproveAuctionHouse,
    approveReceipt: auctionHouseApproveReceipt,
    approveTx: auctionHouseApproveTx,
  } = useAllowance({
    spenderAddress: getAuctionHouse({
      chainId,
      auctionType: auctionType as AuctionType,
    }).address,
    ownerAddress: address,
    tokenAddress: payoutToken?.address as Address,
    decimals: payoutToken?.decimals,
    chainId: payoutToken?.chainId,
    amount: getScaledCapacityWithCuratorFee(
      capacity,
      curatorFee,
      payoutToken?.decimals,
    ),
  });
  // TODO add note on pre-funding: the capacity will be transferred upon creation

  const handleCreate = form.handleSubmit(creationHandler);
  const isValid = form.formState.isValid;

  /// Callbacks allowance
  const dtlProceedsPercentFormValue = form.getValues("dtlProceedsPercent");
  const dtlProceedsPercent =
    !dtlProceedsPercentFormValue || dtlProceedsPercentFormValue.length == 0
      ? 0
      : dtlProceedsPercentFormValue[0] / 100;
  const {
    isSufficientAllowance: isSufficientCallbacksAllowance,
    execute: executeApproveCallback,
    approveReceipt: callbackApproveReceipt,
    approveTx: callbackApproveTx,
  } = useAllowance({
    spenderAddress: getLatestCallback(chainId, callbacksType as CallbacksType)
      .address,
    ownerAddress: address,
    tokenAddress: payoutToken?.address as Address,
    decimals: payoutToken?.decimals,
    chainId: payoutToken?.chainId,
    amount: parseUnits(
      (Number(capacity ?? 0) * dtlProceedsPercent).toString(),
      payoutToken?.decimals,
    ),
  });
  const requiresCallbacksApproval =
    callbacksType === CallbacksType.UNIV2_DTL ||
    callbacksType === CallbacksType.UNIV3_DTL;

  const onSubmit = () => {
    console.log("submit");
    // 1. If we need to approve the auction house
    if (!isSufficientAuctionHouseAllowance) {
      executeApproveAuctionHouse();
      return;
    }

    // 2. If we need to approve the callbacks
    if (requiresCallbacksApproval && !isSufficientCallbacksAllowance) {
      executeApproveCallback();
      return;
    }

    // 3. Otherwise create
    handleCreate();
    return;
  };

  // Handle form validation on token picker modal
  const payoutModalInvalid =
    form.getFieldState("payoutToken.address").invalid ||
    form.getFieldState("payoutToken.logoURI").invalid;

  const allowlistTokenModalInvalid =
    form.getFieldState("allowlistToken.address").invalid ||
    form.getFieldState("allowlistToken.logoURI").invalid;

  // Handle validation and parsing of the allowlist file

  // TODO move this?
  type AllowlistEntry = {
    address: `0x${string}`;
  };

  type AllocatedAllowlistEntry = {
    address: `0x${string}`;
    allocation: string;
  };

  const [fileLoadMessage, setFileLoadMessage] = React.useState<string | null>(
    null,
  );

  const parseAllowlistFile = (results: { data: AllowlistEntry[] }) => {
    // Create allowlist variable
    const allowlist: string[][] = [];

    // Check that the file contains the expected columns
    if (!results.data[0]?.address) {
      form.setValue("allowlist", allowlist);
      setFileLoadMessage("Error: Missing address column in file.");
      return;
    }

    // Iterate through, validate data, and store for submission
    for (const entry of results.data) {
      // Ensure address is valid
      if (entry.address.length == 0) continue;
      if (!entry.address.match(/^(0x)?[0-9a-fA-F]{40}$/)) {
        console.error(`Invalid address: ${entry.address}`);
        continue;
      }
      allowlist.push([entry.address]);
    }

    form.setValue("allowlist", allowlist);

    setFileLoadMessage(
      `Parsed ${allowlist.length} addresses from file and had ${
        results.data.length - 1 - allowlist.length
      } errors.`,
    );
  };

  const parseAllocatedAllowlistFile = (results: {
    data: AllocatedAllowlistEntry[];
  }) => {
    // Create allowlist variable
    const allowlist: string[][] = [];

    // Check that the file contains the expected columns
    if (!results.data[0]?.address) {
      form.setValue("allowlist", allowlist);
      setFileLoadMessage('Error: Missing "address" column in file.');
      return;
    }

    if (!results.data[0]?.allocation) {
      form.setValue("allowlist", allowlist);
      setFileLoadMessage('Error: Missing "allocation" column in file.');
      return;
    }

    // Iterate through, validate data, and store for submission
    for (const entry of results.data) {
      // Ensure address is valid
      if (entry.address.length == 0) continue;
      if (!entry.address.match(/^(0x)?[0-9a-fA-F]{40}$/)) {
        console.error(`Invalid address: ${entry.address}`);
        continue;
      }

      // Ensure allocation is valid
      let allocation;
      try {
        allocation = parseUnits(entry.allocation, quoteToken.decimals);
      } catch (e) {
        console.error("Invalid allocation: ", entry.allocation);
        continue;
      }

      // Add
      allowlist.push([entry.address, formatUnits(allocation, 0)]);
    }

    form.setValue("allowlist", allowlist);

    setFileLoadMessage(
      `Parsed ${allowlist.length} addresses from file and had ${
        results.data.length - 1 - allowlist.length
      } errors.`,
    );
  };

  // Populate the allowlist in the form data
  const handleAllowlistFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    const parseFn =
      callbacksType === CallbacksType.ALLOCATED_MERKLE_ALLOWLIST
        ? parseAllocatedAllowlistFile
        : parseAllowlistFile;

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
      const contents = e.target?.result;

      //@ts-expect-error - TODO: type mismatch
      Papa.parse(contents, {
        header: true,
        complete: parseFn,
      });
    };

    reader.readAsText(file);
  };

  React.useEffect(() => {
    // Clear the file load message if the callbacks type is changed
    setFileLoadMessage(null);
  }, [callbacksType]);

  // If the auction uses UniV2 DTL, we need to check if a pool exists for the base and quote token pair
  // We get the factory address from the callbacks contract
  const { data: uniV2Factory } = useReadContract({
    abi: abis.uniV2Dtl,
    address: getLatestCallback(chainId, callbacksType as CallbacksType).address,
    functionName: "uniV2Factory",
    query: { enabled: callbacksType === CallbacksType.UNIV2_DTL },
  });

  // Validate the UniV2 pool
  const isUniV2PoolQueryEnabled =
    callbacksType === CallbacksType.UNIV2_DTL &&
    !!uniV2Factory &&
    !!payoutToken?.address &&
    !!quoteToken?.address;
  const { data: uniV2Pool } = useReadContract({
    abi: abis.uniV2Factory,
    address: uniV2Factory,
    functionName: "getPair",
    args:
      payoutToken?.address && quoteToken?.address
        ? [getAddress(payoutToken.address), getAddress(quoteToken.address)]
        : undefined,
    query: {
      enabled: isUniV2PoolQueryEnabled,
    },
  });
  useEffect(() => {
    if (uniV2Pool && uniV2Pool !== zeroAddress) {
      console.error(
        `Existing UniV2 pool found for ${payoutToken?.address} and ${quoteToken?.address}: ${uniV2Pool}`,
      );
      form.setError("callbacksType", {
        message:
          "A UniV2 pool already exists for the selected tokens. DTL not supported. It's not recommended to due DTL for tokens that are already liquid.",
      });
      return;
    }

    console.log("Clearing errors for UniV2 pool");
    form.clearErrors("callbacksType");
  }, [uniV2Pool, form, payoutToken?.address, quoteToken?.address]);

  // If the auction uses a UniV3 DTL, we need to check if a pool exists for the base/quote token pair and fee tier
  const { data: uniV3Factory } = useReadContract({
    abi: abis.uniV3Dtl,
    address: getLatestCallback(chainId, callbacksType as CallbacksType).address,
    functionName: "uniV3Factory",
    query: { enabled: callbacksType === CallbacksType.UNIV3_DTL },
  });

  // Validate the UniV3 pool
  const isUniV3PoolQueryEnabled =
    callbacksType === CallbacksType.UNIV3_DTL &&
    !!uniV3Factory &&
    !!payoutToken?.address &&
    !!quoteToken?.address &&
    !!dtlUniV3PoolFee;
  const { data: uniV3Pool } = useReadContract({
    abi: abis.uniV3Factory,
    address: uniV3Factory,
    functionName: "getPool",
    args:
      payoutToken?.address && quoteToken?.address
        ? [
            getAddress(payoutToken.address),
            getAddress(quoteToken.address),
            dtlUniV3PoolFee ? Number(dtlUniV3PoolFee) : 0,
          ]
        : undefined,
    query: {
      enabled: isUniV3PoolQueryEnabled,
    },
  });
  useEffect(() => {
    if (uniV3Pool && uniV3Pool !== zeroAddress) {
      console.error(
        `Existing UniV3 pool found for ${payoutToken?.address} and ${quoteToken?.address} at fee tier ${dtlUniV3PoolFee}: ${uniV3Pool}`,
      );
      form.setError("callbacksType", {
        message:
          "A UniV3 pool already exists for the selected tokens at the selected fee tier. DTL not supported. It's not recommended to due DTL for tokens that are already liquid.",
      });
      return;
    }

    console.log("Clearing errors for UniV3 pool");
    form.clearErrors("callbacksType");
  }, [
    uniV3Pool,
    form,
    payoutToken?.address,
    quoteToken?.address,
    dtlUniV3PoolFee,
  ]);

  // Validate the Baseline callbacks
  const isBaselineQueryEnabled =
    isBaselineCallback(callbacksType) &&
    form.getValues("callbacks") !== undefined;
  // Check here if the auction house address is the same as the one in the baseline callbacks
  const { data: baselineAuctionHouse } = useReadContract({
    abi: abis.baseline,
    address: form.getValues("callbacks") as Address,
    functionName: "AUCTION_HOUSE",
    query: {
      enabled: isBaselineQueryEnabled,
    },
  });
  useEffect(() => {
    if (
      baselineAuctionHouse?.toLowerCase() !== auctionHouseAddress?.toLowerCase()
    ) {
      console.error(
        `Baseline auction house address ${baselineAuctionHouse} does not match the auction house address ${auctionHouseAddress}`,
      );
      form.setError("callbacks", {
        message:
          "The auction house address must be the same as the one in the Baseline callbacks",
      });
      return;
    }

    console.log("Clearing errors for Baseline Auction House");
    form.clearErrors("callbacks");
  }, [baselineAuctionHouse, auctionHouseAddress, form]);

  // Check here if the payout token is the same as the one in the baseline callbacks
  const { data: baselineBaseToken } = useReadContract({
    abi: abis.baseline,
    address: form.getValues("callbacks") as Address,
    functionName: "bAsset",
    query: {
      enabled: isBaselineQueryEnabled,
    },
  });
  useEffect(() => {
    if (
      baselineBaseToken?.toLowerCase() !== payoutToken?.address?.toLowerCase()
    ) {
      console.error(
        `Baseline base token ${baselineBaseToken} does not match the payout token ${payoutToken?.address}`,
      );
      form.setError("payoutToken", {
        message:
          "The payout token must be the same as the one in the Baseline callbacks",
      });
      return;
    }

    console.log("Clearing errors for Baseline base token");
    form.clearErrors("payoutToken");
  }, [baselineBaseToken, payoutToken, form]);

  // Check here if the quote token is the same as the one in the baseline callbacks
  const { data: baselineQuoteToken } = useReadContract({
    abi: abis.baseline,
    address: form.getValues("callbacks") as Address,
    functionName: "RESERVE",
    query: {
      enabled: isBaselineQueryEnabled,
    },
  });
  useEffect(() => {
    if (
      baselineQuoteToken?.toLowerCase() !== quoteToken?.address?.toLowerCase()
    ) {
      console.error(
        `Baseline quote token ${baselineQuoteToken} does not match the quote token ${quoteToken?.address}`,
      );
      form.setError("quoteToken", {
        message:
          "The quote token must be the same as the one in the Baseline callbacks",
      });
      return;
    }

    console.log("Clearing errors for Baseline quote token");
    form.clearErrors("quoteToken");
  }, [baselineQuoteToken, quoteToken, form]);

  // Set the upper anchor tick for the Baseline pool
  const { data: baselinePoolActiveTS } = useReadContract({
    abi: abis.bpool,
    address: baselineBaseToken,
    functionName: "getActiveTS",
    query: {
      enabled: baselineBaseToken !== undefined,
    },
  });
  useEffect(() => {
    form.setValue(
      "baselineAnchorTickU",
      baselinePoolActiveTS?.toString() ?? "0",
    );
    form.setValue(
      "baselinePoolTargetTick",
      baselinePoolActiveTS?.toString() ?? "0",
    );
  }, [baselinePoolActiveTS, form]);

  // Load the balance for the payout token
  const { balance: payoutTokenBalance, decimals: payoutTokenDecimals } =
    useERC20Balance({
      chainId,
      tokenAddress: payoutToken ? (payoutToken.address as Address) : undefined,
      balanceAddress: address,
    });

  useEffect(() => {
    form.setValue(
      "payoutTokenBalance",
      formatUnits(payoutTokenBalance ?? BigInt(0), payoutTokenDecimals ?? 0),
    );
  }, [payoutTokenBalance, payoutTokenDecimals, form]);

  const payoutTokenBalanceDecimal: number =
    payoutTokenBalance && payoutTokenDecimals
      ? Number(formatUnits(payoutTokenBalance, payoutTokenDecimals))
      : 0;

  const createTxnSucceeded = useRef<boolean>(false);

  /**
   * Auctions are read from the subgraph.
   * There can be a delay between an auction creation txn succeeding and the subgraph updating.
   * To avoid users not being able to see their auction, we cache it locally, optimistically.
   */
  useEffect(() => {
    if (createTxnSucceeded.current === true) return;
    if (lotId === undefined || lotId === null) return; // lotId is populated after the txn succeeds

    createTxnSucceeded.current = true;

    const auctionId = getAuctionId(chain!.id, lotId);

    const optimisticAuction = auctionsCache.createOptimisticAuction(
      lotId,
      chain!,
      address!,
      auctionHouseAddress,
      form.getValues(),
    );

    // Optimistically store the auction data in the list of auctions cache
    optimisticUpdate(
      queryClient,
      getAuctionsQueryKey(chainId),
      (cachedAuctions: GetAuctionLotsQuery) =>
        auctionsCache.insertAuction(cachedAuctions, optimisticAuction),
    );

    // Optimistically store the auction data in the auction details cache
    optimisticUpdate(queryClient, getAuctionQueryKey(auctionId), () =>
      auctionCache.create(optimisticAuction),
    );
  }, [address, auctionHouseAddress, chain, chainId, form, lotId, queryClient]);
  const disableMinBidSize = !canUpdateMinBidSize(form.getValues());

  const isReasonableMinBidSize =
    !capacity ||
    !minPrice ||
    !minBidSize ||
    Number(minBidSize) >= (Number(capacity) * Number(minPrice)) / 10_000; //10k here represents a potential max amount of bids

  // Define the options listed in the callback select dropdown
  const callbackOptions = React.useMemo(() => {
    form.resetField("callbacksType");
    const existingCallbacks = getExistingCallbacks(chainId);

    // Define the Baseline callback options
    const baselineCallbackOptions = [
      {
        value: CallbacksType.BASELINE,
        label: callbackLabels[CallbacksType.BASELINE],
      },
      {
        value: CallbacksType.BASELINE_ALLOWLIST,
        label: callbackLabels[CallbacksType.BASELINE_ALLOWLIST],
      },
      {
        value: CallbacksType.BASELINE_ALLOCATED_ALLOWLIST,
        label: callbackLabels[CallbacksType.BASELINE_ALLOCATED_ALLOWLIST],
      },
      {
        value: CallbacksType.BASELINE_CAPPED_ALLOWLIST,
        label: callbackLabels[CallbacksType.BASELINE_CAPPED_ALLOWLIST],
      },
      {
        value: CallbacksType.BASELINE_TOKEN_ALLOWLIST,
        label: callbackLabels[CallbacksType.BASELINE_TOKEN_ALLOWLIST],
      },
    ];

    // Iterate through the existing callbacks and add the Baseline callbacks if they are not present
    baselineCallbackOptions.forEach((option) => {
      if (
        !existingCallbacks.some((callback) => callback.value === option.value)
      ) {
        existingCallbacks.push(option);
      }
    });

    return existingCallbacks;
  }, [chainId, form]);

  const handlePreview = () => {
    form.trigger();
    setStoredConfig(form.getValues());
    isValid && setIsPreviewOpen(true);
  };

  const handleReset = () => {
    form.reset(auctionDefaultValues);
    setResetKey(resetKey + 1);
    setStoredConfig(null);
  };

  const handleSaveForm = () => setStoredConfig(form.getValues());

  const handleGenerateLink = () => {
    const values = JSON.stringify(form.getValues());
    //Strips existing query params from the current URL
    const url = window.location.href.replace(/(\?.*?)(#|$)/, "$2");
    const urlWithData = url + `?data=${values}`;

    navigator.clipboard.writeText(urlWithData);
  };

  return (
    <PageContainer
      id="__AXIS_ORIGIN_CREATE_LAUNCH_PAGE__"
      key={resetKey.toString()}
    >
      <PageHeader
        backNavigationPath="/#"
        backNavigationText="Back to Launches"
      />
      <div className="flex items-center justify-center">
        <h1 className="text-5xl">Launch a token</h1>
      </div>
      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()} className="pb-16">
          <div className="mx-auto flex max-w-3xl justify-around rounded-md p-4">
            <div className="w-full space-y-4">
              <div className="mx-auto grid grid-flow-row grid-cols-2 place-items-center gap-x-4">
                <div className="form-div flex max-w-full justify-between">
                  <Text size="3xl">1 - Your Project</Text>
                  <div>
                    <TriggerMessage message="Link copied!">
                      <Tooltip content="Generate a link to the current configuration">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={handleGenerateLink}
                        >
                          <ShareIcon />
                        </Button>
                      </Tooltip>
                    </TriggerMessage>

                    <Tooltip content="Save the current configuration locally">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleSaveForm}
                      >
                        <DownloadIcon />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Clear the current configuration">
                      <Button size="icon" variant="ghost" onClick={handleReset}>
                        <TrashIcon />
                      </Button>
                    </Tooltip>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItemWrapper
                      label="Name"
                      tooltip="The project or auction name"
                    >
                      <Input placeholder="YourDAO" type="text" {...field} />
                    </FormItemWrapper>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tagline"
                  render={({ field }) => (
                    <FormItemWrapper
                      label="Tagline"
                      tooltip="A brief tagline about your project"
                    >
                      <Input
                        placeholder={"We're the future of France"}
                        {...field}
                      />
                    </FormItemWrapper>
                  )}
                />
                <FormField
                  control={form.control}
                  name="projectLogo"
                  render={({ field }) => (
                    <FormItemWrapper
                      label="Project Logo"
                      tooltip="A URL to the project logo"
                      className="mt-6"
                    >
                      <Input
                        placeholder="https://your-dao.link/tokenjpeg.svg"
                        type="url"
                        {...field}
                      />
                    </FormItemWrapper>
                  )}
                />
                <FormField
                  control={form.control}
                  name="projectBanner"
                  render={({ field }) => (
                    <FormItemWrapper
                      label="Project Banner"
                      tooltip="A URL to a rectangular banner to be displayed along the auction"
                      className="mt-6"
                    >
                      <Input
                        placeholder="https://your-dao.link/banner.svg"
                        type="url"
                        {...field}
                      />
                    </FormItemWrapper>
                  )}
                />

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItemWrapper className="mt-6" label="Website">
                      <Input
                        type="url"
                        placeholder="https://your-dao.link"
                        {...field}
                      />
                    </FormItemWrapper>
                  )}
                />
                <FormField
                  control={form.control}
                  name="discord"
                  render={({ field }) => (
                    <FormItemWrapper className="mt-6" label="Discord">
                      <Input
                        type="url"
                        placeholder="https://discord.gg/your-dao"
                        {...field}
                      />
                    </FormItemWrapper>
                  )}
                />

                <FormField
                  control={form.control}
                  name="twitter"
                  render={({ field }) => (
                    <FormItemWrapper className="mt-6" label="Twitter">
                      <Input
                        placeholder="https://x.com/your-dao"
                        type="url"
                        {...field}
                      />
                    </FormItemWrapper>
                  )}
                />
                <FormField
                  control={form.control}
                  name="farcaster"
                  render={({ field }) => (
                    <FormItemWrapper className="mt-6" label="Warpcast">
                      <Input
                        type="url"
                        placeholder="https://warpcast.com/your-dao"
                        {...field}
                      />
                    </FormItemWrapper>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItemWrapper
                      className="col-span-2 mt-6 max-w-3xl"
                      label="Project description"
                    >
                      <Textarea
                        placeholder="A short description of your project"
                        className="placeholder:text-foreground/50"
                        {...field}
                      />
                    </FormItemWrapper>
                  )}
                />

                <Text size="3xl" className="form-div">
                  2 - Tokens
                </Text>

                <FormField
                  name="payoutToken"
                  render={({ field }) => (
                    <FormItemWrapper
                      label="Payout Token"
                      tooltip="The token that successful bidders will be paid in"
                    >
                      <DialogInput
                        {...field}
                        title="Select Payout Token"
                        triggerContent={"Select token"}
                        disabled={payoutModalInvalid}
                        displayFormatter={tokenDisplayFormatter}
                      >
                        <TokenPicker name="payoutToken" />
                      </DialogInput>
                    </FormItemWrapper>
                  )}
                />

                <FormField
                  name="quoteToken"
                  render={({ field }) => (
                    <FormItemWrapper
                      label="Quote Token"
                      tooltip="The token that bidders will place bids in"
                    >
                      <DialogInput
                        {...field}
                        externalDialog
                        title="Select Quote Token"
                        triggerContent={"Select token"}
                        displayFormatter={tokenDisplayFormatter}
                      >
                        <TokenSelectDialog chainId={chainId} />
                      </DialogInput>
                    </FormItemWrapper>
                  )}
                />

                <Text size="3xl" className="form-div">
                  3 - Style
                </Text>
                <FormField
                  control={form.control}
                  name="auctionType"
                  render={({ field }) => (
                    <FormItemWrapper
                      label="Auction Type"
                      tooltip="The minimum marginal price required for the auction lot to settle"
                    >
                      <Select
                        defaultValue={AuctionType.SEALED_BID}
                        options={[
                          {
                            value: AuctionType.SEALED_BID,
                            label: "Encrypted Marginal Price",
                          },

                          {
                            value: AuctionType.FIXED_PRICE_BATCH,
                            label: "Fixed Price",
                          },
                        ]}
                        {...field}
                      />
                    </FormItemWrapper>
                  )}
                />
                <div className="relative flex w-full flex-wrap">
                  <FormField
                    name="capacity"
                    render={({ field }) => (
                      <FormItemWrapper
                        label="Capacity"
                        tooltip="The capacity of the auction lot in terms of the payout token"
                      >
                        <Input
                          {...field}
                          placeholder="1,000,000"
                          type="number"
                        />
                      </FormItemWrapper>
                    )}
                  />
                  <Text
                    size="xs"
                    color="secondary"
                    uppercase
                    className="absolute -bottom-5 right-0"
                  >
                    Balance:{" "}
                    {payoutTokenBalanceDecimal
                      ? trimCurrency(payoutTokenBalanceDecimal)
                      : "-"}
                  </Text>
                </div>

                <Text size="3xl" className="form-div">
                  4 - Auction Guard Rails
                </Text>

                {auctionType === AuctionType.SEALED_BID && (
                  <>
                    <FormField
                      control={form.control}
                      name="minPrice"
                      render={({ field }) => (
                        <FormItemWrapper
                          label="Minimum Payout Token Price"
                          tooltip="The minimum number of quote tokens to receive per payout token."
                        >
                          <Input placeholder="1" type="number" {...field} />
                        </FormItemWrapper>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="minFillPercent"
                      render={({ field }) => (
                        <FormItemWrapper
                          label="Minimum Filled Percentage"
                          tooltip="Minimum percentage of the capacity that needs to be filled in order for the auction lot to settle"
                        >
                          <PercentageSlider
                            field={field}
                            defaultValue={
                              auctionDefaultValues.minFillPercent[0]
                            }
                          />
                        </FormItemWrapper>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="minBidSize"
                      render={({ field }) => (
                        <FormItemWrapper
                          className="mt-4"
                          label="Minimum Bid Size"
                          tooltip={`The minimum number of quote tokens to be received in a bid. ${
                            disableMinBidSize
                              ? "Capacity and Minimum Bid Price must be set before setting this value."
                              : ""
                          }`}
                        >
                          <div className="relative">
                            <Input
                              {...field}
                              disabled={disableMinBidSize}
                              placeholder="1"
                              type="number"
                            />
                            {!isReasonableMinBidSize && (
                              <Text
                                className="text-feedback-warning absolute"
                                size="xs"
                              >
                                Your min bid size could result in the settlement
                                being expensive due to the number of potential
                                winning bids
                              </Text>
                            )}
                          </div>
                        </FormItemWrapper>
                      )}
                    />

                    {/* Disabled for now*/}
                    {/* <FormField
                      control={form.control}
                      name="minBidPercent"
                      render={({ field }) => (
                        <FormItemWrapper
                          label="Minimum Bid Size / Capacity"
                          tooltip="Each bid will need to be greater than or equal to this percentage of the capacity"
                        >
                          <>
                            <Input
                              disabled
                              className="disabled:opacity-100"
                              value={`${
                                field.value?.[0] ??
                                auctionDefaultValues.minBidPercent
                              }%`}
                            />
                            <Slider
                              {...field}
                              className="cursor-pointer pt-2"
                              min={1}
                              max={100}
                              defaultValue={auctionDefaultValues.minBidPercent}
                              value={field.value}
                              onValueChange={(v) => {
                                field.onChange(v);
                              }}
                            />
                          </>
                        </FormItemWrapper>
                      )}
                    /> */}
                  </>
                )}
                {auctionType === AuctionType.FIXED_PRICE_BATCH && (
                  <>
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItemWrapper
                          label="Price"
                          tooltip="The amount of quote tokens per payout token"
                        >
                          <Input placeholder="1" type="number" {...field} />
                        </FormItemWrapper>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="minFillPercent"
                      render={({ field }) => (
                        <FormItemWrapper
                          label="Minimum Filled Percentage"
                          tooltip="Minimum percentage of the capacity that needs to be filled in order for the auction lot to settle"
                        >
                          <PercentageSlider
                            field={field}
                            defaultValue={
                              auctionDefaultValues.minFillPercent[0]
                            }
                          />
                        </FormItemWrapper>
                      )}
                    />
                  </>
                )}

                <Text size="3xl" className="form-div">
                  5 - Schedule
                </Text>

                <FormField
                  control={form.control}
                  name="start"
                  render={({ field }) => (
                    <FormItemWrapper
                      label="Start"
                      tooltip="The start date/time of the auction lot"
                    >
                      <DatePicker
                        time
                        placeholderDate={addMinutes(new Date(), 5)}
                        content={formatDate.fullLocal(new Date())}
                        minDate={new Date()}
                        {...field}
                      />
                    </FormItemWrapper>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItemWrapper
                      label="Deadline"
                      tooltip="The ending date/time of the auction lot"
                    >
                      <DatePicker
                        time
                        placeholderDate={addDays(addHours(new Date(), 1), 7)}
                        content={formatDate.fullLocal(
                          addDays(start ? (start as Date) : new Date(), 7),
                        )}
                        minDate={addDays(
                          start ? (start as Date) : new Date(),
                          1,
                        )}
                        {...field}
                      />
                    </FormItemWrapper>
                  )}
                />
              </div>
              <div>
                <Text size="3xl" className="form-div">
                  6 - Advanced Settings
                </Text>
                <div className="grid grid-cols-2 place-items-center gap-4">
                  <FormField
                    name="curator"
                    render={({ field }) => (
                      <FormItemWrapper
                        label="Curator"
                        tooltip={"The address of the auction curator"}
                      >
                        <Input
                          {...field}
                          placeholder={trimAddress("0x0000000")}
                        />
                      </FormItemWrapper>
                    )}
                  />{" "}
                  <FormField
                    name="referrerFee"
                    render={({ field }) => (
                      <FormItemWrapper
                        label="Referrer Fee Percentage"
                        tooltip={
                          "The percentual amount of referrer fee you're willing to pay"
                        }
                      >
                        <PercentageSlider
                          field={field}
                          defaultValue={0}
                          max={fees.maxReferrerFee ?? 0}
                        />
                      </FormItemWrapper>
                    )}
                  />{" "}
                  <div className="flex w-full max-w-sm items-center justify-start gap-x-2">
                    <FormField
                      name="isVested"
                      render={({ field }) => (
                        <FormItemWrapper className="mt-4 w-min">
                          <div className="flex items-center gap-x-2">
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                            <Label>Vested</Label>
                          </div>
                        </FormItemWrapper>
                      )}
                    />

                    <FormField
                      name="vestingDuration"
                      render={({ field }) => (
                        <FormItemWrapper label="Vesting Days">
                          <Input
                            type="number"
                            placeholder="7"
                            disabled={!isVested}
                            required={isVested}
                            {...field}
                          />
                        </FormItemWrapper>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="vestingStart"
                    render={({ field }) => (
                      <FormItemWrapper
                        label="Vesting Start"
                        tooltip="The start date/time of the vesting"
                      >
                        <DatePicker
                          time
                          placeholderDate={addMinutes(new Date(), 5)}
                          content={formatDate.fullLocal(new Date())}
                          {...field}
                          minDate={
                            deadline
                              ? (deadline as Date)
                              : addDays(new Date(), 1)
                          }
                        />
                      </FormItemWrapper>
                    )}
                  />
                </div>
                <div>
                  <Text size="3xl" className="form-div">
                    7 - Additional Features
                  </Text>
                  <div className="grid grid-cols-2 place-items-center gap-4">
                    <FormField
                      control={form.control}
                      name="callbacksType"
                      render={({ field }) => (
                        <FormItemWrapper
                          label="Callback"
                          tooltip={
                            "The type of callback contract to use for the auction."
                          }
                        >
                          <Select
                            defaultValue={CallbacksType.NONE}
                            options={callbackOptions ?? []}
                            disabled={callbackOptions.length === 1}
                            {...field}
                          />
                        </FormItemWrapper>
                      )}
                    />
                    {(isSimpleAllowlist(callbacksType) ||
                      isCappedAllowlist(callbacksType)) && (
                      <FormItemWrapper
                        label="Allowlist"
                        tooltip={
                          "File containing list of addresses on the allowlist in CSV format."
                        }
                      >
                        <Input
                          type="file"
                          accept=".csv"
                          onChange={handleAllowlistFileSelect}
                          className="pt-1"
                          error={fileLoadMessage ?? ""}
                        />
                      </FormItemWrapper>
                    )}
                    {isCappedAllowlist(callbacksType) && (
                      <FormField
                        control={form.control}
                        name="cappedAllowlistLimit"
                        render={({ field }) => (
                          <FormItemWrapper
                            label="Per User Spend Limit"
                            tooltip="The number of quote tokens each allowlisted address can spend."
                          >
                            <Input placeholder="10" type="number" {...field} />
                          </FormItemWrapper>
                        )}
                      />
                    )}
                    {isAllocatedAllowlist(callbacksType) && (
                      <FormItemWrapper
                        label="Allowlist"
                        tooltip={
                          "File containing list of addresses and allocations in CSV format." +
                          (quoteToken === undefined
                            ? " Please select a quote token first."
                            : "")
                        }
                      >
                        <Input
                          type="file"
                          accept=".csv"
                          onChange={handleAllowlistFileSelect}
                          disabled={quoteToken === undefined}
                          className="pt-1"
                          error={fileLoadMessage ?? ""}
                        />
                      </FormItemWrapper>
                    )}
                    {isTokenAllowlist(callbacksType) && (
                      <>
                        <FormField
                          name="allowlistToken"
                          render={({ field }) => (
                            <FormItemWrapper
                              label="Allowlist Token"
                              tooltip={
                                "The address of the token to use for the allowlist."
                              }
                            >
                              <DialogInput
                                {...field}
                                title="Select Allowlist Token"
                                triggerContent={"Select token"}
                                disabled={allowlistTokenModalInvalid}
                              >
                                <TokenPicker name="allowlistToken" />
                              </DialogInput>
                            </FormItemWrapper>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="allowlistTokenThreshold"
                          render={({ field }) => (
                            <FormItemWrapper
                              label="Required Token Balance"
                              tooltip="The number of tokens the address must hold to qualify for the allowlist."
                            >
                              <Input placeholder="1" type="number" {...field} />
                            </FormItemWrapper>
                          )}
                        />
                      </>
                    )}
                    {(callbacksType === CallbacksType.UNIV2_DTL ||
                      callbacksType === CallbacksType.UNIV3_DTL) && (
                      <>
                        <FormField
                          control={form.control}
                          name="dtlProceedsPercent"
                          render={({ field }) => (
                            <FormItemWrapper
                              className="mt-4"
                              label="Percent of Proceeds to Deposit"
                              tooltip="Percent of the auction proceeds to deposit into the liquidity pool."
                            >
                              <PercentageSlider
                                field={field}
                                defaultValue={75}
                              />
                            </FormItemWrapper>
                          )}
                        />
                        <FormField
                          name="dtlRecipient"
                          render={({ field }) => (
                            <FormItemWrapper
                              label="Liquidity Recipient"
                              tooltip={
                                "The address that will receive the liquidity tokens"
                              }
                            >
                              <Input
                                {...field}
                                placeholder={trimAddress("0x0000000")}
                              />
                            </FormItemWrapper>
                          )}
                        />{" "}
                        <div className="flex w-full max-w-sm items-center justify-start gap-x-2">
                          <FormField
                            name="dtlIsVested"
                            render={({ field }) => (
                              <FormItemWrapper className="mt-4 w-min">
                                <div className="flex items-center gap-x-2">
                                  <Switch onCheckedChange={field.onChange} />
                                  <Label>Liquidity Vested</Label>
                                </div>
                              </FormItemWrapper>
                            )}
                          />
                          <FormField
                            name="dtlVestingDuration"
                            render={({ field }) => (
                              <FormItemWrapper label="Liquidity Vesting Days">
                                <Input
                                  type="number"
                                  placeholder="7"
                                  disabled={!dtlIsVested}
                                  required={dtlIsVested}
                                  {...field}
                                />
                              </FormItemWrapper>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="dtlVestingStart"
                          render={({ field }) => (
                            <FormItemWrapper
                              label="Liquidity Vesting Start"
                              tooltip="The start date/time of the liquidity vesting"
                            >
                              <DatePicker
                                time
                                placeholderDate={addMinutes(new Date(), 5)}
                                content={formatDate.fullLocal(new Date())}
                                {...field}
                                minDate={
                                  deadline
                                    ? (deadline as Date)
                                    : addDays(new Date(), 1)
                                }
                              />
                            </FormItemWrapper>
                          )}
                        />
                      </>
                    )}
                    {callbacksType === CallbacksType.UNIV3_DTL && (
                      <FormField
                        control={form.control}
                        name="dtlUniV3PoolFee"
                        render={({ field }) => (
                          <FormItemWrapper
                            label="UniV3 Pool Fee"
                            tooltip={
                              "The fee to set on the Uniswap V3 pool on creation."
                            }
                          >
                            <Select
                              defaultValue={"3000"}
                              // TODO consider fetching the fee tiers from the Uniswap V3 factory address stored on the callback contract
                              options={[
                                {
                                  value: "500",
                                  label: "0.05%",
                                },
                                {
                                  value: "3000",
                                  label: "0.3%",
                                },
                                {
                                  value: "10000",
                                  label: "1.0%",
                                },
                              ]}
                              {...field}
                            />
                          </FormItemWrapper>
                        )}
                      />
                    )}
                    {isBaselineCallback(callbacksType) && (
                      <>
                        <FormField
                          name="callbacks"
                          render={({ field }) => (
                            <FormItemWrapper
                              label="Callbacks Address"
                              tooltip={
                                "The address of the Baseline callbacks contract."
                              }
                            >
                              <Input
                                {...field}
                                placeholder={trimAddress("0x0000000")}
                              />
                            </FormItemWrapper>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="dtlProceedsPercent"
                          render={({ field }) => (
                            <FormItemWrapper
                              className="mt-4"
                              label="Percent of Proceeds to Deposit"
                              tooltip="Percent of the auction proceeds to deposit into the liquidity pool."
                            >
                              <PercentageSlider
                                field={field}
                                min={1}
                                max={100}
                              />
                            </FormItemWrapper>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="baselineFloorReservesPercent"
                          render={({ field }) => (
                            <FormItemWrapper
                              className="mt-4"
                              label="Percent of Liquidity in Floor"
                              tooltip="Percent of the auction proceeds to deposit into the liquidity pool."
                            >
                              <PercentageSlider
                                field={field}
                                min={10}
                                max={100}
                              />
                            </FormItemWrapper>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="baselineFloorRangeGap"
                          render={({ field }) => (
                            <FormItemWrapper
                              className="mt-4"
                              label="Gap Between Floor and Anchor"
                              tooltip="The gap (in terms of tick spacings) between the floor and anchor ticks."
                            >
                              <Input {...field} type="number" min={0} />
                            </FormItemWrapper>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="baselineAnchorTickWidth"
                          render={({ field }) => (
                            <FormItemWrapper
                              className="mt-4"
                              label="Anchor Tick Width"
                              tooltip="The width (in terms of tick spacings) of the anchor tick."
                            >
                              <Input
                                {...field}
                                placeholder="10"
                                type="number"
                                min={1}
                                max={50}
                              />
                            </FormItemWrapper>
                          )}
                        />
                        <FormField
                          name="dtlRecipient"
                          render={({ field }) => (
                            <FormItemWrapper
                              label="Liquidity Recipient"
                              tooltip={
                                "The address that will receive the liquidity tokens"
                              }
                            >
                              <Input
                                {...field}
                                placeholder={trimAddress("0x0000000")}
                              />
                            </FormItemWrapper>
                          )}
                        />
                      </>
                    )}
                    {/* {callbacksType === CallbacksType.CUSTOM && (
                      <>
                        <FormField
                          name="callbacks"
                          render={({ field }) => (
                            <FormItemWrapper
                              label="Custom Callbacks Address"
                              tooltip={
                                "The address of the custom callbacks contract."
                              }
                            >
                              <Input
                                {...field}
                                placeholder={trimAddress("0x0000000")}
                              />
                            </FormItemWrapper>
                          )}
                        />
                        <FormField
                          name="customCallbackData"
                          render={({ field }) => (
                            <FormItemWrapper
                              label="Calldata for Custom Callback"
                              tooltip={
                                "The calldata to pass to the custom callback on auction creation."
                              }
                            >
                              <Input
                                {...field}
                                placeholder={trimAddress("0x0000000")}
                              />
                            </FormItemWrapper>
                          )}
                        />
                      </>
                    )} */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <RequiresChain chainId={chainId} className="mt-4 w-fit">
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  handlePreview();
                }}
              >
                DEPLOY AUCTION
              </Button>
            </RequiresChain>
          </div>
          <DialogRoot
            open={isTxDialogOpen}
            onOpenChange={(open) => !open && setIsTxDialogOpen(false)}
          >
            <DialogContent className="bg-surface ">
              <DialogHeader>
                <DialogTitle>
                  {createTxReceipt.isSuccess ? "Success" : "Creating Auction"}
                </DialogTitle>
              </DialogHeader>
              <div className="px-6">
                <AuctionCreationStatus
                  lotId={lotId}
                  auctionType={auctionType as AuctionType}
                  requiresCallbacksApproval={requiresCallbacksApproval}
                  isSufficientAuctionHouseAllowance={
                    isSufficientAuctionHouseAllowance
                  }
                  isSufficientCallbacksAllowance={
                    isSufficientCallbacksAllowance
                  }
                  chainId={chainId}
                  auctionHouseApproveTx={auctionHouseApproveTx}
                  auctionHouseApproveReceipt={auctionHouseApproveReceipt}
                  callbackApproveTx={callbackApproveTx}
                  callbackApproveReceipt={callbackApproveReceipt}
                  info={auctionInfoMutation}
                  //@ts-expect-error debug
                  keypair={generateKeyPairMutation}
                  tx={createAuctionTx}
                  txReceipt={createTxReceipt}
                  onSubmit={onSubmit}
                  onSuccess={() => {
                    if (lotId && chain) {
                      navigate(
                        getAuctionPath({
                          chainId: chain.id,
                          lotId: lotId.toString(),
                        }),
                      );
                    }
                  }}
                />
              </div>
            </DialogContent>
          </DialogRoot>
          <DevTool control={form.control} />
        </form>
        <CreateAuctionPreview
          open={isPreviewOpen}
          onOpenChange={setIsPreviewOpen}
          chainId={chainId}
          initiateCreateTx={() => setIsTxDialogOpen(true)}
        />
      </Form>
    </PageContainer>
  );
}

function getCreatedAuctionId(
  value: UseWaitForTransactionReceiptReturnType["data"],
) {
  const lotIdHex = value?.logs[1].topics[1];
  if (!lotIdHex) return null;
  return fromHex(lotIdHex, "number");
}

function canUpdateMinBidSize(form: CreateAuctionForm) {
  return !!form.capacity && !!form.minPrice;
}

function tokenDisplayFormatter(token: Token) {
  return {
    label: token.symbol,
    imgURL: token.logoURI,
    value: token.symbol,
  };
}

function clearNullishFields(fields: Partial<CreateAuctionForm>) {
  return Object.fromEntries(
    Object.entries(fields).filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    ),
  );
}

function formatDates(fields: Partial<CreateAuctionForm>) {
  const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

  return Object.fromEntries(
    Object.entries(fields).map(([key, value]) => {
      return [
        key,
        typeof value === "string" && iso8601Regex.test(value)
          ? new Date(value)
          : value,
      ];
    }),
  );
}
