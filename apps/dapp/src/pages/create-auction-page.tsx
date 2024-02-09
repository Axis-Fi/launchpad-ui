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
import { encodeAbiParameters, getAddress, toHex, zeroAddress } from "viem";

const tokenSchema = z.object({
  address: z.string().regex(/^(0x)?[0-9a-fA-F]{40}$/),
  chainId: z.coerce.number(),
  decimals: z.coerce.number(),
  symbol: z.string(),
});

const schema = z.object({
  quoteToken: tokenSchema,
  payoutToken: tokenSchema,
  amount: z.string(),
  minPrice: z.string(),
  deadline: z.date(),
  hooks: z.string().optional(),
  allowlist: z.string().optional(),
  allowlistParams: z.string().optional(),
  isVested: z.boolean().optional(),
  vesting: z.string().optional(),
  curator: z.string().optional(),
  vestingExpiry: z.date().optional(),
});

export type CreateAuctionForm = z.infer<typeof schema>;

export default function CreateAuctionPage() {
  const form = useForm<CreateAuctionForm>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const [isVested, payoutToken] = form.watch(["isVested", "payoutToken"]);

  const axisAddresses = axisContracts.addresses[payoutToken?.chainId];
  const createAuction = useWriteContract();

  const handleCreation = async (values: CreateAuctionForm) => {
    const publicKey = await cloakClient.keysApi.newKeyPairPost();

    if (!publicKey) throw new Error("Unable to generate RSA keypair");

    createAuction.writeContract({
      abi: axisContracts.abis.auctionHouse,
      address: axisAddresses.auctionHouse,
      functionName: "auction",
      args: [
        {
          auctionType: toHex("LSBBA"),
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
          payoutData: toHex(""),
          derivativeType: !values.isVested ? toHex("") : toHex("LIV"),
          derivativeParams: !values.vestingExpiry
            ? toHex("")
            : encodeAbiParameters(
                [{ name: "expiry", type: "48" }],
                [{ expiry: values.vestingExpiry.getTime() / 1000 }],
              ),
        },
        //@ts-expect-error file is WIP
        {
          // TODO AuctionParams
        },
      ],
    });
  };

  // TODO add expiry timestamp when vesting

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
                    <FormItemWrapper label="Quote Token">
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
                  name="amount"
                  render={({ field }) => (
                    <FormItemWrapper label="Amount">
                      <Input {...field} type="number" />
                    </FormItemWrapper>
                  )}
                />

                <FormField
                  name="payoutToken"
                  render={({ field }) => (
                    <FormItemWrapper label="Payout Token">
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
                    <FormItemWrapper label="Minimum Price">
                      <Input type="number" {...field} />
                    </FormItemWrapper>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItemWrapper label="Deadline">
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
                            <FormItemWrapper className="order-1" label="Hooks">
                              <Input
                                {...field}
                                tooltip={
                                  "What is the address of the hook contract"
                                }
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
                            >
                              <Input
                                {...field}
                                tooltip={
                                  "What is the address of the allowlist contract"
                                }
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
                            >
                              <Input
                                {...field}
                                tooltip={
                                  "What is the address of the auction curator"
                                }
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
                            name="vesting"
                            render={({ field }) => (
                              <FormItemWrapper label="Vesting Days">
                                <Input
                                  type="number"
                                  disabled={!isVested}
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

          <CreateAuctionSubmitter />
        </form>
      </Form>
    </div>
  );
}
