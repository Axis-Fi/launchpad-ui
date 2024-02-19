import {
  DatePicker,
  DialogInput,
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

import { TokenPicker } from "components/token-picker";
import { CreateAuctionSubmitter } from "modules/auction/create-auction-submitter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cloakClient } from "src/services/cloak";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { axisContracts } from "@repo/contracts";
import {
  Address,
  encodeAbiParameters,
  getAddress,
  isHex,
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
import { AuctionInfo } from "src/types";

import { storeAuctionInfo } from "loaders/useAuctionInfo";
import { addDays, addHours, addMinutes } from "date-fns";
import { MutationDialog } from "modules/transactions/mutation-dialog";
import { useMutation } from "@tanstack/react-query";

const tokenSchema = z.object({
  address: z.string().regex(/^(0x)?[0-9a-fA-F]{40}$/),
  chainId: z.coerce.number(),
  decimals: z.coerce.number(),
  symbol: z.string(),
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

function toKeycode(keycode: string): `0x${string}` {
  return toHex(keycode, { size: 5 });
}

const auctionDefaultValues = {
  minFillPercent: [50],
  minBidPercent: [5],
  quoteToken: {
    address: "",
    chainId: 1,
    symbol: "USDB",
  },
};

export default function CreateAuctionPage() {
  const form = useForm<CreateAuctionForm>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: auctionDefaultValues,
  });

  const [isVested, payoutToken, chainId] = form.watch([
    "isVested",
    "payoutToken",
    "quoteToken.chainId",
  ]);

  const axisAddresses = axisContracts.addresses[payoutToken?.chainId];
  const createAuction = useWriteContract();
  const createTxReceipt = useWaitForTransactionReceipt({
    hash: createAuction.data,
  });

  const createDependenciesMutation = useMutation({
    mutationFn: async (values: CreateAuctionForm) => {
      const auctionInfo: AuctionInfo = {
        name: values.name,
        description: values.description,
        links: {
          projectLogo: values.projectLogo,
          payoutTokenLogo: values.payoutTokenLogo,
          website: values.website,
          twitter: values.twitter,
          discord: values.discord,
          farcaster: values.farcaster,
        },
      };

      // Store the auction info
      const auctionInfoAddress = await storeAuctionInfo(auctionInfo);
      if (!auctionInfoAddress) {
        throw new Error("Unable to store info on IPFS");
      }

      // Get the public key
      const publicKey = await cloakClient.keysApi.newKeyPairPost();
      if (!isHex(publicKey)) {
        throw new Error("Invalid or no keypair received");
      }

      return { publicKey, auctionInfoAddress };
    },
    onError: (error) => {
      // It will also show in the interface
      console.error("Error during submission:", error);
    },
  });

  const handleCreation = async (values: CreateAuctionForm) => {
    const { publicKey, auctionInfoAddress } =
      await createDependenciesMutation.mutateAsync(values);

    createAuction.writeContract(
      {
        abi: axisContracts.abis.auctionHouse,
        address: axisAddresses.auctionHouse,
        functionName: "auction",
        args: [
          {
            auctionType: toKeycode("LSBBA"),
            baseToken: getAddress(values.payoutToken.address),
            quoteToken: getAddress(values.quoteToken.address),
            curator: !values.curator ? zeroAddress : getAddress(values.curator),
            hooks: !values.hooks ? zeroAddress : getAddress(values.hooks),
            allowlist: !values.allowlist
              ? zeroAddress
              : getAddress(values.allowlist),
            allowlistParams: !values.allowlistParams
              ? toHex("")
              : toHex(values.allowlistParams),
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
                    { name: "minFillPercent", type: "uint24" },
                    { name: "minBidPercent", type: "uint24" },
                    { name: "minimumPrice", type: "uint256" },
                    {
                      name: "publicKeyModulus",
                      type: "bytes",
                    },
                  ],
                  name: "AuctionDataParams",
                  type: "tuple",
                },
              ],
              [
                {
                  minFillPercent: getPercentage(
                    Number(values.minFillPercent[0]),
                  ),
                  minBidPercent: getPercentage(Number(values.minBidPercent[0])),
                  minimumPrice: parseUnits(
                    values.minPrice,
                    values.payoutToken.decimals,
                  ),
                  publicKeyModulus: publicKey as Address,
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

  // TODO add note on pre-funding (LSBBA-specific): the capacity will be transferred upon creation

  const onSubmit = form.handleSubmit(handleCreation);
  // TODO arrange fields

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
                <h3 className="form-div ">1 Your Project</h3>
                <div />

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
                {/* <FormField */}
                {/*   control={form.control} */}
                {/*   name="description" */}
                {/*   render={({ field }) => ( */}
                {/*     <FormItemWrapper */}
                {/*       label="Description" */}
                {/*       tooltip="The description of your auction or project" */}
                {/*     > */}
                {/*       <Input */}
                {/*         placeholder="A short description of your project" */}
                {/*         {...field} */}
                {/*       /> */}
                {/*     </FormItemWrapper> */}
                {/*   )} */}
                {/* /> */}

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
                {/* <FormField */}
                {/*   control={form.control} */}
                {/*   name="payoutTokenLogo" */}
                {/*   render={({ field }) => ( */}
                {/*     <FormItemWrapper */}
                {/*       label="Payout Token Logo" */}
                {/*       tooltip="A URL to the Payout token logo" */}
                {/*       className="mt-6" */}
                {/*     > */}
                {/*       <Input */}
                {/*         placeholder="https://your-dao.link/jpeg.svg" */}
                {/*         type="url" */}
                {/*         {...field} */}
                {/*       /> */}
                {/*     </FormItemWrapper> */}
                {/*   )} */}
                {/* /> */}
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
                <div />

                <FormField
                  name="payoutToken"
                  render={({ field }) => (
                    <FormItemWrapper
                      label="Payout Token"
                      tooltip="The token that successful bidders will be paid in"
                    >
                      <DialogInput
                        title="Select Payout Token"
                        triggerContent={"Select token"}
                        {...field}
                      >
                        <TokenPicker />
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
                        title="Select Quote Token"
                        triggerContent={"Select token"}
                        display={{
                          value: field.value?.address,
                          label: field.value?.symbol,
                          imgURL: "/blast-logo.png",
                        }}
                        {...field}
                      >
                        <TokenPicker />
                      </DialogInput>
                    </FormItemWrapper>
                  )}
                />

                <h3 className="form-div">3 Quantity</h3>
                <div />
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
                <div />

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
                <div />

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

          <CreateAuctionSubmitter>
            <MutationDialog
              submitText="DEPLOY AUCTION"
              triggerContent="DEPLOY AUCTION"
              hash={createAuction.data!}
              chainId={chainId}
              mutation={createTxReceipt}
              disabled={!form.formState.isValid}
              onConfirm={onSubmit}
              error={createDependenciesMutation.error} // TODO need to combine this with createAuction somehow, so that errors are shown
            />
          </CreateAuctionSubmitter>
        </form>
      </Form>
    </div>
  );
}
