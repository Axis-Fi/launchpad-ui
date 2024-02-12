import {
  DatePicker,
  DialogInput,
  Form,
  FormField,
  FormItemWrapper,
  Input,
  Label,
  Switch,
  AccordionContent,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
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
  minFillPercent: z.string(),
  minBidPercent: z.string(),
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
  const { isPending, writeContract, ...createAuctionProps } =
    useWriteContract();

  // TODO handle displaying errors from createAuctionProps.error
  if (createAuctionProps.error) {
    console.error("Error during submission:", createAuctionProps.error);
  }

  const handleCreation = async (values: CreateAuctionForm) => {
    const publicKey = await cloakClient.keysApi.newKeyPairPost();

    if (!publicKey) throw new Error("Unable to generate RSA keypair");
    if (!isHex(publicKey)) throw new Error("Invalid keypair");

    writeContract({
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
          payoutData: toHex(""), // TODO remove this after new deployment
          derivativeType: !values.isVested ? toKeycode("") : toKeycode("LIV"),
          derivativeParams: !values.vestingDuration
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
          duration: getTimestamp(values.deadline) - getTimestamp(values.start),
          capacityInQuote: false, // Disabled for LSBBA
          capacity: parseUnits(values.capacity, values.payoutToken.decimals),
          implParams: encodeAbiParameters(
            [
              { name: "minFillPercent", type: "uint24" },
              { name: "minBidPercent", type: "uint24" },
              { name: "minimumPrice", type: "uint256" },
              {
                name: "publicKeyModulus",
                type: "bytes",
              },
            ],
            [
              getPercentage(Number(values.minFillPercent)),
              getPercentage(Number(values.minBidPercent)),
              parseUnits(values.minPrice, values.payoutToken.decimals),
              publicKey,
            ],
          ),
        },
      ],
    });
    console.log("submitted");
  };

  // TODO add note on pre-funding (LSBBA-specific): the capacity will be transferred upon creation

  return (
    <div className="pt-10">
      <h1 className="text-6xl">Create Auction</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleCreation)}>
          <div className="mt-4 flex justify-around rounded-md border-y p-4">
            <div className="w-full space-y-4">
              <h3>Configure</h3>
              <div className="grid w-full grid-cols-2 place-items-center gap-y-8">
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

                <FormField
                  control={form.control}
                  name="minFillPercent"
                  render={({ field }) => (
                    <FormItemWrapper
                      label="Minimum Capacity Filled"
                      tooltip="Minimum percentage of the capacity that needs to be filled in order for the auction lot to settle"
                    >
                      <Input type="number" {...field} />
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
                      <Input type="percent" {...field} />
                    </FormItemWrapper>
                  )}
                />

                <FormField
                  control={form.control}
                  name="start"
                  render={({ field }) => (
                    <FormItemWrapper
                      label="Start"
                      tooltip="The start date/time of the auction lot"
                    >
                      <DatePicker {...field} />
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
                      <DatePicker {...field} />
                    </FormItemWrapper>
                  )}
                />
              </div>
              <div>
                <AccordionRoot type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="justify-center text-xs font-semibold data-[state=closed]:before:content-['Show\00a0'] data-[state=open]:before:content-['Hide\00a0']">
                      Optional Settings
                    </AccordionTrigger>
                    <AccordionContent>
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
                    </AccordionContent>
                  </AccordionItem>
                </AccordionRoot>
              </div>
            </div>
          </div>

          <CreateAuctionSubmitter isPending={isPending} />
        </form>
      </Form>
    </div>
  );
}
