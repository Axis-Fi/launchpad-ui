import {
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
import { getDuration, getTimestamp, formatDate, dateMath } from "src/utils";

import { AuctionInfo, AuctionType, CallbacksType } from "@repo/types";

import { storeAuctionInfo } from "modules/auction/hooks/use-auction-info";
import { addDays, addHours, addMinutes } from "date-fns";
import { useMutation } from "@tanstack/react-query";
import React from "react";
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

const optionalURL = z.union([z.string().url().optional(), z.literal("")]);

const tokenSchema = z.object({
  address: z.string().regex(/^(0x)?[0-9a-fA-F]{40}$/, "Invalid address"),
  chainId: z.coerce.number(),
  decimals: z.coerce.number(),
  symbol: z.string(),
  logoURI: optionalURL,
});

const schema = z
  .object({
    quoteToken: tokenSchema,
    payoutToken: tokenSchema,
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
    name: z.string(),
    description: z.string(),
    projectLogo: z.string().url().optional(),
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
  );

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
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
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
    "start",
    "deadline",
  ]);

  const chainId = _chainId ?? connectedChainId;

  const createAuctionTx = useWriteContract();
  const createTxReceipt = useWaitForTransactionReceipt({
    hash: createAuctionTx.data,
  });
  const lotId = getCreatedAuctionId(
    createTxReceipt.data,
    auctionType as AuctionType,
  );

  const auctionInfoMutation = useMutation({
    mutationFn: async (values: CreateAuctionForm) => {
      const auctionInfo: AuctionInfo = {
        key: `${values.auctionType}-${values.payoutToken.chainId}_${values.payoutToken.address}`,
        name: values.name,
        description: values.description,
        allowlist: values.allowlist,
        links: {
          projectLogo: values.projectLogo,
          payoutTokenLogo: values.payoutToken.logoURI,
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

  const { isSufficientAllowance, execute, approveReceipt, approveTx } =
    useAllowance({
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

  const onSubmit = () => {
    isSufficientAllowance ? createAuction() : execute();
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
        console.log("Invalid allocation: ", entry.allocation);
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

  return (
    <>
      <PageHeader className="items-center justify-start pb-10">
        <h1 className="text-5xl">Create Your Auction</h1>
      </PageHeader>
      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()}>
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
                <h3 className="form-div">1 Your Project</h3>

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
                  name="projectLogo"
                  render={({ field }) => (
                    <FormItemWrapper
                      label="Project Logo"
                      tooltip="A URL to the project logo"
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

                <h3 className="form-div ">2 Tokens</h3>

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

                <h3 className="form-div">3 Style</h3>
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
                <FormField
                  name="capacity"
                  render={({ field }) => (
                    <FormItemWrapper
                      label="Capacity"
                      tooltip="The capacity of the auction lot in terms of the payout token"
                    >
                      <Input {...field} placeholder="1,000,000" type="number" />
                    </FormItemWrapper>
                  )}
                />

                <h3 className="form-div">4 Auction Guard Rails</h3>

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
                          className="mt-4"
                          label="Minimum Filled Percentage"
                          tooltip="Minimum percentage of the capacity that needs to be filled in order for the auction lot to settle"
                        >
                          <>
                            <Input
                              disabled
                              className="disabled:opacity-100"
                              value={`${
                                field.value?.[0] ??
                                auctionDefaultValues.minFillPercent
                              }%`}
                            />
                            <Slider
                              {...field}
                              className="cursor-pointer pt-2"
                              min={1}
                              max={100}
                              defaultValue={auctionDefaultValues.minFillPercent}
                              value={field.value}
                              onValueChange={(v) => {
                                field.onChange(v);
                              }}
                            />
                          </>
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
                          className="mt-4"
                          label="Minimum Filled Percentage"
                          tooltip="Minimum percentage of the capacity that needs to be filled in order for the auction lot to settle"
                        >
                          <>
                            <Input
                              disabled
                              className="disabled:opacity-100"
                              value={`${
                                field.value?.[0] ??
                                auctionDefaultValues.minFillPercent
                              }%`}
                            />
                            <Slider
                              {...field}
                              className="cursor-pointer pt-2"
                              min={1}
                              max={100}
                              defaultValue={auctionDefaultValues.minFillPercent}
                              value={field.value}
                              onValueChange={(v) => {
                                field.onChange(v);
                              }}
                            />
                          </>
                        </FormItemWrapper>
                      )}
                    />
                  </>
                )}

                <h3 className="form-div">5 Schedule</h3>

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
                <h3 className="form-div">6 Advanced Settings</h3>
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
                    callbacksType == CallbacksType.CAPPED_MERKLE_ALLOWLIST) && (
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
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <RequiresChain chainId={chainId} className="mt-4 w-fit">
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  form.trigger();
                  isValid && setIsDialogOpen(true);
                }}
              >
                DEPLOY AUCTION
              </Button>
            </RequiresChain>
          </div>
          <DialogRoot
            open={isDialogOpen}
            onOpenChange={(open) => !open && setIsDialogOpen(false)}
          >
            <DialogContent className="bg-surface max-w-sm">
              <DialogHeader>
                <DialogTitle>
                  {createTxReceipt.isSuccess ? "Success" : "Creating Auction"}
                </DialogTitle>
              </DialogHeader>
              <div className="px-6">
                <AuctionCreationStatus
                  lotId={lotId}
                  chainId={chainId}
                  approveTx={approveTx}
                  approveReceipt={approveReceipt}
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
      </Form>
    </>
  );
}

function getCreatedAuctionId(
  value: UseWaitForTransactionReceiptReturnType["data"],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  auctionType: AuctionType,
) {
  //TODO: find a better way to handle this
  //on EMP auctioniD is on log index 1 pos 1
  //on FPS on log 1 pos 1
  const logIndex = 1;
  const lotIdHex = value?.logs[logIndex].topics[1];
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
