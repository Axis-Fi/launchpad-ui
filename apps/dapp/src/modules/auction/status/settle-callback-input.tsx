import { Auction, CallbacksType } from "@repo/types";
import { getCallbacksType } from "../utils/get-callbacks-type";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItemWrapper, Input } from "@repo/ui";
import { encodeAbiParameters } from "viem";

const uniswapSchema = z
  .object({
    maxSlippage: z.string().optional(),
  })
  .refine(
    (data) =>
      data.maxSlippage &&
      Number(data.maxSlippage) >= 0.001 &&
      Number(data.maxSlippage) < 100,
    {
      message: "Slippage must be >= 0 and < 100",
      path: ["maxSlippage"],
    },
  );
type UniswapForm = z.infer<typeof uniswapSchema>;

export function SettleAuctionCallbackInput({
  auction,
  setCallbackData,
  setCallbackDataIsValid,
}: {
  auction: Auction;
  setCallbackData: (data: `0x${string}`) => void;
  setCallbackDataIsValid: (isValid: boolean) => void;
}) {
  // Determine the callback type
  const callbackType = getCallbacksType(auction);

  const form = useForm<UniswapForm>({
    resolver: zodResolver(uniswapSchema),
    mode: "onBlur",
  });

  if (
    callbackType === CallbacksType.UNIV2_DTL ||
    callbackType === CallbacksType.UNIV3_DTL
  ) {
    // Monitor changes to the form
    form.watch((data) => {
      if (Number(data.maxSlippage) < 0.001 || Number(data.maxSlippage) >= 100) {
        setCallbackDataIsValid(false);
        return;
      }

      const maxSlippage = (Number(data.maxSlippage) || 0) * 1e3; // Upscale to 1e5
      const encodedCallbackData = encodeAbiParameters(
        [
          {
            name: "OnClaimProceedsParams",
            type: "tuple",
            components: [{ name: "maxSlippage", type: "uint24" }],
          },
        ],
        [
          {
            maxSlippage: maxSlippage,
          },
        ],
      );

      // Encode the data in the required struct and pass it to the parent component
      setCallbackData(encodedCallbackData);

      // Flag the callback data as valid
      setCallbackDataIsValid(true);
    });

    return (
      <Form {...form}>
        <div className="grid grid-flow-row grid-cols-2">
          <FormField
            control={form.control}
            name="maxSlippage"
            render={({ field }) => (
              <FormItemWrapper
                label="Max Slippage"
                tooltip="The percentage of slippage tolerated when depositing into the pool."
              >
                <Input placeholder="0.5" type="number" {...field} />
              </FormItemWrapper>
            )}
          />
        </div>
      </Form>
    );
  }

  return <></>;
}
