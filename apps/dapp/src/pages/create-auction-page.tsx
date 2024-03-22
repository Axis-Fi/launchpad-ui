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
import { cloakClient } from "src/services/cloak";
import {
  useAccount,
  useChainId,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { axisContracts } from "@repo/deployments";
import {
  Address,
  encodeAbiParameters,
  fromHex,
  getAddress,
  Hex,
  parseUnits,
  toHex,
  zeroAddress,
} from "viem";
import {
  getPercentage,
  getDuration,
  getTimestamp,
  formatDate,
  dateMath,
} from "src/utils";

import { AuctionInfo } from "@repo/types";

import { storeAuctionInfo } from "modules/auction/hooks/use-auction-info";
import { addDays, addHours, addMinutes } from "date-fns";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { AuctionCreationStatus } from "modules/auction/auction-creation-status";
import { useAllowance } from "loaders/use-allowance";
import { RequiresWalletConnection } from "components/requires-wallet-connection";
import { toKeycode } from "modules/auction/utils/to-keycode";
import { TokenSelectDialog } from "modules/token/token-select-dialog";

const tokenSchema = z.object({
  address: z.string().regex(/^(0x)?[0-9a-fA-F]{40}$/, "Invalid address"),
  chainId: z.coerce.number(),
  decimals: z.coerce.number(),
  symbol: z.string(),
  logoURI: z.string().url().optional(),
});

const schema = z
  .object({
    quoteToken: tokenSchema,
    payoutToken: tokenSchema,
    capacity: z.string(),
    minFillPercent: z.array(z.number()),
    minBidPercent: z.array(z.number()),
    minPrice: z.string(),
    start: z.date(),
    deadline: z.date(),
    hooks: z
      .string()
      .regex(/^(0x)?[0-9a-fA-F]{40}$/)
      .optional(),
    allowlist: z
      .string()
      .regex(/^(0x)?[0-9a-fA-F]{40}$/)
      .optional(),
    allowlistParams: z.string().optional(),
    isVested: z.boolean().optional(),
    curator: z
      .string()
      .regex(/^(0x)?[0-9a-fA-F]{40}$/)
      .optional(),
    vestingDuration: z.string().optional(),
    // Metadata
    name: z.string(),
    description: z.string(),
    projectLogo: z.string().url().optional(),
    twitter: z.string().url().optional(),
    discord: z.string().url().optional(),
    website: z.string().url().optional(),
    farcaster: z.string().url().optional(),
    payoutTokenLogo: z.string().url().optional(),
  })
  .refine(
    (data) => (!data.isVested ? true : data.isVested && data.vestingDuration),
    {
      message: "Vesting duration is required",
      path: ["vestingDuration"],
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
  );

export type CreateAuctionForm = z.infer<typeof schema>;

const auctionDefaultValues = {
  minFillPercent: [50],
  minBidPercent: [5],
};

export default function CreateAuctionPage() {
  const { address } = useAccount();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const connectedChainId = useChainId();
  const form = useForm<CreateAuctionForm>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: auctionDefaultValues,
  });

  const [isVested, payoutToken, _chainId, capacity] = form.watch([
    "isVested",
    "payoutToken",
    "quoteToken.chainId",
    "capacity",
  ]);

  const chainId = _chainId ?? connectedChainId;

  const axisAddresses = axisContracts.addresses[payoutToken?.chainId];
  const createAuctionTx = useWriteContract();
  const createTxReceipt = useWaitForTransactionReceipt({
    hash: createAuctionTx.data,
  });

  const auctionInfoMutation = useMutation({
    mutationFn: async (values: CreateAuctionForm) => {
      const auctionInfo: AuctionInfo = {
        key: values.payoutToken.chainId + "_" + values.payoutToken.address,
        name: values.name,
        description: values.description,
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

      if (!publicKey.x || !publicKey.y) {
        throw new Error("No public key received");
      }

      const updatedKey = {
        x: fromHex(publicKey.x as Hex, "bigint"),
        y: fromHex(publicKey.y as Hex, "bigint"),
      };

      return updatedKey;
    },
    onError: (error) => console.error("Error during submission:", error),
  });

  const handleCreation = async (values: CreateAuctionForm) => {
    const auctionInfoAddress = await auctionInfoMutation.mutateAsync(values);
    const publicKey = await generateKeyPairMutation.mutateAsync();

    createAuctionTx.writeContract(
      {
        abi: axisContracts.abis.auctionHouse,
        address: axisAddresses.auctionHouse,
        functionName: "auction",
        args: [
          {
            auctionType: toKeycode("EMPAM"),
            baseToken: getAddress(values.payoutToken.address),
            quoteToken: getAddress(values.quoteToken.address),
            curator: !values.curator ? zeroAddress : getAddress(values.curator),
            callbacks: !values.hooks ? zeroAddress : getAddress(values.hooks),
            derivativeType: !values.isVested ? toKeycode("") : toKeycode("LIV"),
            derivativeParams:
              !values.isVested || !values.vestingDuration
                ? toHex("")
                : encodeAbiParameters(
                    [{ name: "expiry", type: "uint48" }],
                    [
                      getTimestamp(values.deadline) +
                        getDuration(Number(values.vestingDuration)),
                    ],
                  ),
            //TODO: Check these parameters
            wrapDerivative: false, //TODO: add missing inputs to UI
            callbackData: toHex(""),
            prefunded: true,
          },
          {
            start: getTimestamp(values.start),
            duration:
              getTimestamp(values.deadline) - getTimestamp(values.start),
            capacityInQuote: false, // Disabled for LSBBA
            capacity: parseUnits(values.capacity, values.payoutToken.decimals),
            implParams: encodeAbiParameters(
              [
                {
                  components: [
                    { name: "minPrice", type: "uint96" },
                    { name: "minFillPercent", type: "uint24" },
                    { name: "minBidPercent", type: "uint24" },
                    {
                      name: "publicKey",
                      internalType: "struct Point",
                      type: "tuple",
                      components: [
                        { name: "x", internalType: "uint256", type: "uint256" },
                        { name: "y", internalType: "uint256", type: "uint256" },
                      ],
                    },
                  ],
                  name: "AuctionDataParams",
                  internalType: "struct AuctionDataParams",
                  type: "tuple",
                },
              ],
              [
                {
                  minFillPercent: getPercentage(
                    Number(values.minFillPercent[0]),
                  ),
                  minBidPercent: getPercentage(Number(values.minBidPercent[0])),
                  minPrice: parseUnits(
                    values.minPrice,
                    values.payoutToken.decimals,
                  ),
                  publicKey,
                },
              ],
            ),
          },
          auctionInfoAddress,
        ],
      },
      {
        onError: (error) => {
          console.error("Error during submission:", error);
        },
      },
    );
  };
  const { isSufficientAllowance, execute, approveReceipt, approveTx } =
    useAllowance({
      ownerAddress: address,
      spenderAddress: axisAddresses?.auctionHouse,
      tokenAddress: payoutToken?.address as Address,
      decimals: payoutToken?.decimals,
      chainId: payoutToken?.chainId,
      amount: Number(capacity),
    });
  // TODO add note on pre-funding (LSBBA-specific): the capacity will be transferred upon creation

  const createAuction = form.handleSubmit(handleCreation);
  const isValid = form.formState.isValid;

  const onSubmit = () => (isSufficientAllowance ? createAuction() : execute());

  return (
    <div className="pb-20">
      <h1 className="text-5xl">Create Your Auction</h1>
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

                <h3 className="form-div">3 Quantity</h3>
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

                <FormField
                  control={form.control}
                  name="minPrice"
                  render={({ field }) => (
                    <FormItemWrapper
                      label="Minimum Payout Token Price"
                      tooltip="The minimum marginal price required for the auction lot to settle"
                    >
                      <Input placeholder="1" type="number" {...field} />
                    </FormItemWrapper>
                  )}
                />

                <h3 className="form-div">4 Auction Guard Rails</h3>

                <FormField
                  control={form.control}
                  name="minFillPercent"
                  render={({ field }) => (
                    <FormItemWrapper
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

                <FormField
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
                />

                <h3 className="form-div">4 Schedule</h3>

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
                          dateMath.addDays(new Date(), 7),
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
                    name="hooks"
                    render={({ field }) => (
                      <FormItemWrapper
                        label="Hooks"
                        tooltip={"The address of the hook contract"}
                      >
                        <Input
                          {...field}
                          placeholder={trimAddress("0x0000000")}
                        />
                      </FormItemWrapper>
                    )}
                  />
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
                    name="allowlist"
                    render={({ field }) => (
                      <FormItemWrapper
                        label="Allowlist"
                        tooltip={"The address of the allowlist contract"}
                      >
                        <Input
                          {...field}
                          placeholder={trimAddress("0x0000000")}
                        />
                      </FormItemWrapper>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <RequiresWalletConnection rootClassName="mt-4">
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  form.trigger();
                  isValid && setIsDialogOpen(true);
                }}
              >
                DEPLOY AUCTION
              </Button>
            </RequiresWalletConnection>
          </div>
          <DialogRoot
            open={isDialogOpen}
            onOpenChange={(open) => !open && setIsDialogOpen(false)}
          >
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>
                  {createTxReceipt.isSuccess ? "Success" : "Creating Auction"}
                </DialogTitle>
              </DialogHeader>
              <div className="px-6">
                <AuctionCreationStatus
                  chainId={chainId}
                  approveTx={approveTx}
                  approveReceipt={approveReceipt}
                  info={auctionInfoMutation}
                  keypair={generateKeyPairMutation}
                  tx={createAuctionTx}
                  txReceipt={createTxReceipt}
                  onSubmit={onSubmit}
                />
              </div>
            </DialogContent>
          </DialogRoot>
          <DevTool control={form.control} />
        </form>
      </Form>
    </div>
  );
}
