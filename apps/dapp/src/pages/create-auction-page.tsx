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
} from "@repo/ui";

import { TokenPicker } from "components/token-picker";
import { CreateAuctionSubmitter } from "modules/auction/create-auction-submitter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cloakClient } from "src/services/cloak";
import { useWriteContract } from "wagmi";
import { axisContracts } from "@repo/contracts";
import {
  encodeAbiParameters,
  getAddress,
  isHex,
  parseUnits,
  toHex,
  zeroAddress,
} from "viem";
import { getDuration, getTimestamp } from "loaders/dateHelper";
import { getPercentage } from "loaders/numberHelper";

const tokenSchema = z.object({
  address: z.string().regex(/^(0x)?[0-9a-fA-F]{40}$/),
  chainId: z.coerce.number(),
  decimals: z.coerce.number(),
  symbol: z.string(),
});

const schema = z.object({
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
  twitter: z.string().optional(),
  discord: z.string().optional(),
  website: z.string().optional(),
  description: z.string().optional(),
  tokenLogo: z.string().optional(),
});

export type CreateAuctionForm = z.infer<typeof schema>;

function toKeycode(keycode: string): `0x${string}` {
  return toHex(keycode, { size: 5 });
}

export default function CreateAuctionPage() {
  const form = useForm<CreateAuctionForm>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const [isVested, payoutToken] = form.watch(["isVested", "payoutToken"]);

  const axisAddresses = axisContracts.addresses[payoutToken?.chainId];
  const createAuction = useWriteContract();

  // TODO if there is no approval, this will still execute in addition to the approval tx
  // TODO handle/display errors
  // TODO fix state of submit button during creation
  const handleCreation = async (values: CreateAuctionForm) => {
    const publicKey = await cloakClient.keysApi.newKeyPairPost();

    if (!publicKey) throw new Error("Unable to generate RSA keypair");
    if (!isHex(publicKey)) throw new Error("Invalid keypair");

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
                  publicKeyModulus: publicKey,
                },
              ],
            ),
          },
        ],
      },
      {
        onError: (error) => {
          console.error("Error during submission:", error);
        },
      },
    );
    console.log("submitted");
  };

  // TODO add note on pre-funding (LSBBA-specific): the capacity will be transferred upon creation

  return (
    <div className="pb-20 pt-10">
      <h1 className="text-6xl">Create Your Auction</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleCreation)}>
          <div className="mt-4 flex justify-around rounded-md p-4">
            <div className="w-full space-y-4">
              <div className="grid grid-flow-row grid-cols-2 place-items-center ">
                <h3 className="form-div ">1 Tokens</h3>
                <div />
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
                        {...field}
                      >
                        <TokenPicker />
                      </DialogInput>
                    </FormItemWrapper>
                  )}
                />

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

                <h3 className="form-div">2 Quantity</h3>
                <div />
                <FormField
                  name="capacity"
                  render={({ field }) => (
                    <FormItemWrapper
                      label="Capacity"
                      tooltip="The capacity of the auction lot in terms of the payout token"
                    >
                      <Input {...field} type="number" />
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
                      <Input type="number" {...field} />
                    </FormItemWrapper>
                  )}
                />

                <h3 className="form-div">3 Auction Guard Rails</h3>
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
                        <Input value={(field.value?.[0] ?? 50) + " " + "%"} />
                        <Slider
                          {...field}
                          className="cursor-pointer pt-2"
                          max={100}
                          defaultValue={[50]}
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
                        <Input value={(field.value?.[0] ?? 5) + " " + "%"} />
                        <Slider
                          {...field}
                          className="cursor-pointer pt-2"
                          max={100}
                          defaultValue={[5]}
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
                      <DatePicker time {...field} />
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
                      <DatePicker time {...field} />
                    </FormItemWrapper>
                  )}
                />

                <h3 className="form-div">5 Metadata</h3>
                <div />

                <FormField
                  control={form.control}
                  name="tokenLogo"
                  render={({ field }) => (
                    <FormItemWrapper
                      label="Payout Token Logo"
                      tooltip="A URL to the Payout token logo"
                    >
                      <Input type="percent" {...field} />
                    </FormItemWrapper>
                  )}
                />
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItemWrapper label="Website">
                      <Input type="percent" {...field} />
                    </FormItemWrapper>
                  )}
                />
                <div className="col-span-2 mt-4" />
                <FormField
                  control={form.control}
                  name="twitter"
                  render={({ field }) => (
                    <FormItemWrapper label="Twitter">
                      <Input type="percent" {...field} />
                    </FormItemWrapper>
                  )}
                />
                <FormField
                  control={form.control}
                  name="discord"
                  render={({ field }) => (
                    <FormItemWrapper label="Discord">
                      <Input type="percent" {...field} />
                    </FormItemWrapper>
                  )}
                />
                <div className="col-span-2 mt-4" />
              </div>
              <div>
                {/*TODO: Fix this*/}
                <h3 className="form-div ml-[82px]">6 Optional Settings</h3>
                <div className="grid grid-cols-2 place-items-center gap-y-4">
                  <FormField
                    name="hooks"
                    render={({ field }) => (
                      <FormItemWrapper
                        className="order-1"
                        label="Hooks"
                        tooltip={"The address of the hook contract"}
                      >
                        <Input
                          {...field}
                          // TODO validate using isAddress
                        />
                      </FormItemWrapper>
                    )}
                  />
                  <FormField
                    name="allowlist"
                    render={({ field }) => (
                      <FormItemWrapper
                        label="Allowlist"
                        className="order-3"
                        tooltip={"The address of the allowlist contract"}
                      >
                        <Input
                          {...field}
                          // TODO validate using isAddress
                        />
                      </FormItemWrapper>
                    )}
                  />
                  <FormField
                    name="curator"
                    render={({ field }) => (
                      <FormItemWrapper
                        label="Curator"
                        className="order-3"
                        tooltip={"The address of the auction curator"}
                      >
                        <Input
                          {...field}
                          // TODO validate using isAddress
                        />
                      </FormItemWrapper>
                    )}
                  />{" "}
                  <div className="order-2 flex w-full max-w-sm items-center justify-start gap-x-2">
                    <FormField
                      name="isVested"
                      render={({ field }) => (
                        <FormItemWrapper className="mt-4 w-min">
                          <div className="flex items-center gap-x-2">
                            <Switch onCheckedChange={field.onChange} />
                            <Label>Vested?</Label>
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
                            disabled={!isVested}
                            required={isVested}
                            // TODO validation
                            {...field}
                          />
                        </FormItemWrapper>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <CreateAuctionSubmitter isPending={createAuction.isPending} />
        </form>
      </Form>
    </div>
  );
}
