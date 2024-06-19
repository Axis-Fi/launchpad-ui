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
  Slider,
  Switch,
  Textarea,
  trimAddress,
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
} from "src/utils";

import { AuctionInfo, AuctionType, CallbacksType } from "@repo/types";

import { storeAuctionInfo } from "modules/auction/hooks/use-auction-info";
import { addDays, addHours, addMinutes } from "date-fns";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { AuctionCreationStatus } from "modules/auction/auction-creation-status";
import { useAllowance } from "loaders/use-allowance";
import { toKeycode } from "utils/hex";
import { TokenSelectDialog } from "modules/token/token-select-dialog";
import { getAuctionCreateParams } from "modules/auction/utils/get-auction-create-params";
import { RequiresChain } from "components/requires-chain";
import { PageHeader } from "modules/app/page-header";
import { getLinearVestingParams } from "modules/auction/utils/get-derivative-params";
import { useNavigate } from "react-router-dom";
import { getAuctionHouse, getCallbacks } from "utils/contracts";
import { Chain } from "@rainbow-me/rainbowkit";
import Papa from "papaparse";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { PageContainer } from "modules/app/page-container";
import useERC20Balance from "loaders/use-erc20-balance";
import { CreateAuctionPreview } from "./create-auction-preview";

const optionalURL = z.union([z.string().url().optional(), z.literal("")]);

const tokenSchema = z.object({
  address: z.string().regex(/^(0x)?[0-9a-fA-F]{40}$/, "Invalid address"),
  chainId: z.coerce.number(),
  decimals: z.coerce.number(),
  symbol: z.string(),
  logoURI: optionalURL,
  totalSupply: z.bigint().optional(),
});

const schema = z
  .object({
    quoteToken: tokenSchema,
    payoutToken: tokenSchema,
    payoutTokenBalance: z.string().optional(),
    capacity: z.string(),
    auctionType: z.string(),
    minFillPercent: z.array(z.number()).optional(),
    minBidSize: z.array(z.number()).optional(),
    minPrice: z.string().optional(),
    price: z.string().optional(),
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
    dtlVestingDuration: z.string().optional(),
    dtlRecipient: z
      .string()
      .regex(/^(0x)?[0-9a-fA-F]{40}$/)
      .optional(),
    dtlUniV3PoolFee: z.string().optional(),
    customCallbackData: z
      .string()
      .regex(/^(0x)?[0-9a-fA-F]$/)
      .optional(),
    isVested: z.boolean().optional(),
    curator: z
      .string()
      .regex(/^(0x)?[0-9a-fA-F]{40}$/)
      .optional(),
    vestingDuration: z.string().optional(),
    vestingStart: z.date().optional(),
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
    payoutTokenLogo: optionalURL,
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
    (data) => addDays(data.start, 1).getTime() <= data.deadline.getTime(),
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
      // Only required for FPB and FPA
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
      !(data.callbacksType === CallbacksType.UNIV3_DTL)
        ? true
        : data.dtlUniV3PoolFee,
    {
      message: "UniV3 pool fee is required",
      path: ["dtlUniV3PoolFee"],
    },
  )
  .refine((data) => Number(data.payoutTokenBalance) >= Number(data.capacity), {
    message: "Insufficient balance",
    path: ["capacity"],
  });

export type CreateAuctionForm = z.infer<typeof schema>;

export default function CreateAuctionPage() {
  const navigate = useNavigate();
  const auctionDefaultValues = {
    minFillPercent: [50],
    minBidSize: [1], // TODO allows users to specify this value in the UI
    auctionType: AuctionType.SEALED_BID,
    start: dateMath.addMinutes(new Date(), 15),
  };
  const { address } = useAccount();
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  const [isTxDialogOpen, setIsTxDialogOpen] = React.useState(false);
  const connectedChainId = useChainId();
  const { chain } = useAccount();

  const form = useForm<CreateAuctionForm>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: auctionDefaultValues,
  });

  const [
    isVested,
    payoutToken,
    quoteToken,
    _chainId,
    capacity,
    auctionType,
    callbacksType,
    dtlIsVested,
    dtlUniV3PoolFee,
    start,
    deadline,
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
  ]);

  const chainId = _chainId ?? connectedChainId;

  const createAuctionTx = useWriteContract();
  const createTxReceipt = useWaitForTransactionReceipt({
    hash: createAuctionTx.data,
  });
  const lotId = getCreatedAuctionId(createTxReceipt.data);

  const auctionInfoMutation = useMutation({
    mutationFn: async (values: CreateAuctionForm) => {
      const auctionInfo: AuctionInfo = {
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

  const handleCreation = async (values: CreateAuctionForm) => {
    const auctionInfoAddress = await auctionInfoMutation.mutateAsync(values);
    const auctionType = values.auctionType as AuctionType;
    const isEMP = auctionType === AuctionType.SEALED_BID;
    const isFPB = auctionType === AuctionType.FIXED_PRICE_BATCH;
    const code = isEMP ? "EMPA" : isFPB ? "FPBA" : "unknown";

    const auctionTypeKeycode = toKeycode(code);

    const { address: contractAddress, abi } = getAuctionHouse({
      auctionType,
      chainId,
    });

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
      callbacks = getCallbacks(chainId, callbacksType).address;
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
        const allowlistTree =
          values.allowlist &&
          StandardMerkleTree.of(values.allowlist, ["address"]);
        const root = (allowlistTree?.root ?? "0x") as `0x${string}`;
        callbackData = encodeAbiParameters(
          parseAbiParameters("bytes32 merkleRoot"),
          [root],
        );
        break;
      }
      case CallbacksType.CAPPED_MERKLE_ALLOWLIST: {
        const cap = parseUnits(
          values.cappedAllowlistLimit ?? "0",
          values.quoteToken.decimals,
        );
        const allowlistTree =
          values.allowlist &&
          StandardMerkleTree.of(values.allowlist, ["address"]);
        const root = (allowlistTree?.root ?? "0x") as `0x${string}`;
        callbackData = encodeAbiParameters(
          parseAbiParameters("bytes32 merkleRoot, uint256 cap"),
          [root, cap],
        );
        break;
      }
      case CallbacksType.ALLOCATED_MERKLE_ALLOWLIST: {
        // TODO need to handle errors here? May not be necessary since we are validating the file format
        const allowlistTree =
          values.allowlist &&
          StandardMerkleTree.of(values.allowlist, ["address", "uint256"]);
        const root = (allowlistTree?.root ?? "0x") as `0x${string}`;
        callbackData = encodeAbiParameters(
          parseAbiParameters("bytes32 merkleRoot"),
          [root],
        );
        break;
      }
      case CallbacksType.TOKEN_ALLOWLIST: {
        const allowlistToken = (values.allowlistToken?.address ??
          zeroAddress) as `0x${string}`;
        const threshold = parseUnits(
          values.allowlistTokenThreshold ?? "0",
          values.allowlistToken?.decimals ?? 0,
        );
        callbackData = encodeAbiParameters(
          parseAbiParameters("address token, uint256 threshold"),
          [allowlistToken, threshold],
        );
        break;
      }
      case CallbacksType.UNIV2_DTL: {
        const proceedsPercent = values.dtlProceedsPercent
          ? (values.dtlProceedsPercent[0] ?? 0) * 1000
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
          ? (values.dtlProceedsPercent[0] ?? 0) * 1000
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
    }

    createAuctionTx.writeContract(
      {
        abi,
        address: contractAddress,
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
                      getTimestamp(values.deadline) +
                      getDuration(Number(values.vestingDuration)),
                    start: getTimestamp(values.vestingStart ?? values.start),
                  }),
            wrapDerivative: false,
            callbackData: callbackData,
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
    amount: Number(capacity),
  });
  // TODO add note on pre-funding: the capacity will be transferred upon creation

  const createAuction = form.handleSubmit(handleCreation);
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
    spenderAddress: getCallbacks(chainId, callbacksType as CallbacksType)
      .address,
    ownerAddress: address,
    tokenAddress: payoutToken?.address as Address,
    decimals: payoutToken?.decimals,
    chainId: payoutToken?.chainId,
    amount: Number(capacity) * dtlProceedsPercent,
  });
  const requiresCallbacksApproval =
    callbacksType === CallbacksType.UNIV2_DTL ||
    callbacksType === CallbacksType.UNIV3_DTL;

  const onSubmit = () => {
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
    createAuction();
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
    address: getCallbacks(chainId, callbacksType as CallbacksType).address,
    functionName: "uniV2Factory",
    query: { enabled: callbacksType === CallbacksType.UNIV2_DTL },
  });

  const { data: uniV2Pool } = useReadContract({
    abi: abis.uniV2Factory,
    address: uniV2Factory,
    functionName: "getPair",
    args:
      payoutToken && quoteToken
        ? [getAddress(payoutToken.address), getAddress(quoteToken.address)]
        : undefined,
    query: {
      enabled:
        callbacksType === CallbacksType.UNIV2_DTL &&
        !!uniV2Factory &&
        !!payoutToken?.address &&
        !!quoteToken?.address,
    },
  });

  // If the auction uses a UniV3 DTL, we need to check if a pool exists for the base/quote token pair and fee tier
  const { data: uniV3Factory } = useReadContract({
    abi: abis.uniV3Dtl,
    address: getCallbacks(chainId, callbacksType as CallbacksType).address,
    functionName: "uniV3Factory",
    query: { enabled: callbacksType === CallbacksType.UNIV3_DTL },
  });

  const { data: uniV3Pool } = useReadContract({
    abi: abis.uniV3Factory,
    address: uniV3Factory,
    functionName: "getPool",
    args:
      payoutToken && quoteToken
        ? [
            getAddress(payoutToken.address),
            getAddress(quoteToken.address),
            dtlUniV3PoolFee ? Number(dtlUniV3PoolFee) : 0,
          ]
        : undefined,
    query: {
      enabled:
        callbacksType === CallbacksType.UNIV3_DTL &&
        !!uniV3Factory &&
        !!payoutToken?.address &&
        !!quoteToken?.address &&
        !!dtlUniV3PoolFee,
    },
  });

  if (uniV2Pool && uniV2Pool !== zeroAddress) {
    form.setError("callbacksType", {
      message:
        "A UniV2 pool already exists for the selected tokens. DTL not supported. It's not recommended to due DTL for tokens that are already liquid.",
    });
  }

  if (uniV3Pool && uniV3Pool !== zeroAddress) {
    form.setError("callbacksType", {
      message:
        "A UniV3 pool already exists for the selected tokens at the selected fee tier. DTL not supported. It's not recommended to due DTL for tokens that are already liquid.",
    });
  }

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
  }, [payoutTokenBalance, payoutTokenDecimals]);

  const payoutTokenBalanceDecimal: number =
    payoutTokenBalance && payoutTokenDecimals
      ? Number(formatUnits(payoutTokenBalance, payoutTokenDecimals))
      : 0;

  return (
    <PageContainer>
      <PageHeader className="items-center justify-start">
        <h1 className="text-5xl">Create Your Auction</h1>
      </PageHeader>
      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()} className="pb-16">
          <div className="mx-auto flex max-w-3xl justify-around rounded-md p-4">
            <div className="w-full space-y-4">
              {/* <div> */}
              {/*   Creating an auction will involve the following: */}
              {/*   <ol> */}
              {/*     <li> */}
              {/*       If necessary, authorising the spending of the payout token */}
              {/*     </li> */}
              {/*     <li> */}
              {/*       Pre-funding the auction with the payout token and capacity */}
              {/*       selected */}
              {/*     </li> */}
              {/*   </ol> */}
              {/* </div> */}

              <div className="mx-auto grid grid-flow-row grid-cols-2 place-items-center gap-x-4">
                <Text size="3xl" className="form-div">
                  1 - Your Project
                </Text>

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
                        type="url"
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
                          <div className="flex items-center">
                            <Input
                              disabled
                              className="w-16 disabled:opacity-100"
                              value={`${
                                field.value?.[0] ??
                                auctionDefaultValues.minFillPercent
                              }%`}
                            />
                            <Slider
                              {...field}
                              className="cursor-pointer"
                              min={1}
                              max={100}
                              defaultValue={auctionDefaultValues.minFillPercent}
                              value={field.value}
                              onValueChange={(v) => {
                                field.onChange(v);
                              }}
                            />
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
                          <div className="flex items-center">
                            <Input
                              disabled
                              className="w-16 disabled:opacity-100"
                              value={`${
                                field.value?.[0] ??
                                auctionDefaultValues.minFillPercent
                              }%`}
                            />
                            <Slider
                              {...field}
                              className="cursor-pointer"
                              min={1}
                              max={100}
                              defaultValue={auctionDefaultValues.minFillPercent}
                              value={field.value}
                              onValueChange={(v) => {
                                field.onChange(v);
                              }}
                            />
                          </div>
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
                  <div className="flex w-full max-w-sm items-center justify-start gap-x-2">
                    <FormField
                      name="isVested"
                      render={({ field }) => (
                        <FormItemWrapper className="mt-4 w-min">
                          <div className="flex items-center gap-x-2">
                            <Switch onCheckedChange={field.onChange} />
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
                            options={[
                              {
                                value: CallbacksType.NONE,
                                label: "None",
                              },
                              {
                                value: CallbacksType.MERKLE_ALLOWLIST,
                                label: "Offchain Allowlist",
                              },
                              {
                                value: CallbacksType.CAPPED_MERKLE_ALLOWLIST,
                                label: "Offchain Allowlist with Spend Cap",
                              },
                              {
                                value: CallbacksType.ALLOCATED_MERKLE_ALLOWLIST,
                                label: "Offchain Allowlist with Allocations",
                              },
                              {
                                value: CallbacksType.TOKEN_ALLOWLIST,
                                label: "Token Allowlist",
                              },
                              {
                                value: CallbacksType.UNIV2_DTL,
                                label: "Deposit to Uniswap V2 Pool",
                              },
                              {
                                value: CallbacksType.UNIV3_DTL,
                                label: "Deposit to Uniswap V3 Pool",
                              },
                              // {
                              //   value: CallbacksType.CUSTOM,
                              //   label: "Custom",
                              // },
                            ]}
                            {...field}
                          />
                        </FormItemWrapper>
                      )}
                    />
                    {(callbacksType == CallbacksType.MERKLE_ALLOWLIST ||
                      callbacksType ==
                        CallbacksType.CAPPED_MERKLE_ALLOWLIST) && (
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
                    {callbacksType == CallbacksType.CAPPED_MERKLE_ALLOWLIST && (
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
                    {callbacksType ===
                      CallbacksType.ALLOCATED_MERKLE_ALLOWLIST && (
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
                    {callbacksType === CallbacksType.TOKEN_ALLOWLIST && (
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
                              <>
                                <Input
                                  disabled
                                  className="disabled:opacity-100"
                                  value={`${field.value?.[0] ?? [75]}%`}
                                />
                                <Slider
                                  {...field}
                                  className="cursor-pointer pt-2"
                                  min={1}
                                  max={100}
                                  defaultValue={[75]}
                                  value={field.value}
                                  onValueChange={(v) => {
                                    field.onChange(v);
                                  }}
                                />
                              </>
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
                  form.trigger();
                  isValid && setIsPreviewOpen(true);
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
                        generateAuctionURL(
                          auctionType as AuctionType,
                          lotId,
                          chain,
                        ),
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

function generateAuctionURL(
  auctionType: AuctionType,
  lotId: number,
  chain: Chain,
) {
  //Transform viem/rainbowkit names into subgraph format
  const chainName = chain.name.replace(" ", "-").toLowerCase();

  const { address: auctionHouse } = getAuctionHouse({
    auctionType,
    chainId: chain.id,
  });

  return `/auction/${auctionType}/${chainName}-${auctionHouse.toLowerCase()}-${lotId}`;
}
