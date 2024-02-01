import { Checkbox, DatePicker, DialogInput, Input, Label } from "@repo/ui";
import {
  AccordionContent,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
} from "@repo/ui";
import { TokenPicker } from "components/token-picker";
import { useCreateAuctionReducer } from "modules/auction/create-auction-reducer";
import { Token } from "src/types";
import { CreateAuctionSubmitter } from "./create-auction-submitter";

//TODO: implement
export default function CreateAuctionPage() {
  const { state, dispatch, actions } = useCreateAuctionReducer();

  const hasTokens = state.quoteToken && state.payoutToken;

  return (
    <div className="pt-16">
      <h1>Create Auction</h1>
      <div className="mt-4 flex justify-around rounded-md border-y p-4">
        <div className="w-full space-y-4">
          <h3>Configure</h3>
          <div className="grid grid-cols-2 place-items-center gap-y-4">
            <DialogInput
              title="Select Quote Token"
              label="Quote Token"
              triggerContent={"Select token"}
              onSubmit={(value?: Token) =>
                value && dispatch({ type: actions.UPDATE_QUOTE_TOKEN, value })
              }
            >
              <TokenPicker />
            </DialogInput>

            <Input
              type="number"
              label="Amount"
              onChange={(e) => {
                dispatch({
                  type: actions.UPDATE_AMOUNT,
                  value: Number(e.target.value),
                });
              }}
            />

            <DialogInput
              title="Select Payout Token"
              label="Payout Token"
              triggerContent={"Select token"}
              onSubmit={(value?: Token) =>
                value && dispatch({ type: actions.UPDATE_PAYOUT_TOKEN, value })
              }
            >
              <TokenPicker />
            </DialogInput>

            <DatePicker
              id="deadline"
              label="Deadline"
              onChange={(date) => {
                if (date) {
                  dispatch({ type: actions.UPDATE_DEADLINE, value: date });
                }
              }}
            />
            <Input
              id="min-price"
              type="number"
              label="Minimum Price"
              onChange={(e) => {
                dispatch({
                  type: actions.UPDATE_MIN_PRICE,
                  value: Number(e.target.value),
                });
              }}
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
                    <Input
                      tooltip="What are hooks"
                      label="Hooks"
                      onChange={(e) =>
                        dispatch({
                          type: actions.UPDATE_HOOKS,
                          value: e.target.value,
                        })
                      }
                    />
                    <Input
                      tooltip={"What is the allowlist"}
                      label="Allowlist"
                      onChange={(e) =>
                        dispatch({
                          type: actions.UPDATE_ALLOWLIST,
                          value: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex w-full justify-center gap-x-2">
                    <div className="flex items-center gap-x-2">
                      <Checkbox
                        className="h-4 w-4"
                        onCheckedChange={(e) => {
                          dispatch({
                            type: actions.UPDATE_DERIVATIVE_VESTING,
                            value: { isVested: !!e },
                          });
                        }}
                      />
                      <Label>Vested?</Label>
                    </div>
                    <Input
                      type="number"
                      disabled={!state.isVested}
                      onChange={(e) =>
                        dispatch({
                          type: actions.UPDATE_DERIVATIVE_VESTING,
                          value: { days: parseInt(e.target.value) },
                        })
                      }
                      label="Vesting Days"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </AccordionRoot>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-md p-4">
        <h2 className="text-center">Summary</h2>
        <div>
          <p>Quote: {state.quoteToken?.symbol} </p>
          <p>Amount: {state.amount}</p>
          <p>
            MinPrice: {state.minPrice}{" "}
            {hasTokens
              ? `${state.quoteToken?.symbol} per ${state.payoutToken?.symbol}`
              : ""}
          </p>
          <p>Deadline: {state.deadline?.toString()}</p>
        </div>
      </div>

      <CreateAuctionSubmitter state={state} />
    </div>
  );
}
