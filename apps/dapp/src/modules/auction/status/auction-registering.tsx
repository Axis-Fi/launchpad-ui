/* eslint-disable */

import {
  Input,
  Card,
  FormItemWrapper,
  FormField,
  Form,
  Button,
} from "@repo/ui";
import { PropsWithAuction } from "@repo/types";
import { AuctionCoreMetrics } from "../auction-core-metrics";
import { ProjectInfoCard } from "../project-info-card";
import { TokenInfoCard } from "../token-info-card";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TokenAmountInput } from "modules/token/token-amount-input";
import { useMutation } from "@tanstack/react-query";
import { Address, zeroAddress } from "viem";
import { useProfile } from "modules/points/hooks/use-profile";

export function AuctionRegistering({ auction }: PropsWithAuction) {
  return (
    <div className="auction-action-container h-full items-stretch gap-x-4 lg:flex">
      <div className="space-y-4 lg:w-2/3">
        <AuctionCoreMetrics auction={auction} />
        <TokenInfoCard auction={auction} />
        <ProjectInfoCard auction={auction} />
      </div>
      <div className="items-strech h-full lg:w-1/3">
        <Card title="Register your Interest">
          <AuctionRegisteringForm auction={auction} />
        </Card>
      </div>
    </div>
  );
}

const schema = z.object({
  commitAmount: z.string(),
});

type CommitForm = z.infer<typeof schema>;

function AuctionRegisteringForm(props: PropsWithAuction) {
  const auth = useProfile();

  const form = useForm<CommitForm>({
    mode: "onChange",
    delayError: 600,
    resolver: zodResolver(schema),
  });

  const handleSignIn = () => {
    //TODO: figure out how the auth flow will work
    //auth.isUserRegistered ? auth.register.mutate() : auth.signIn.mutate()
  };

  const mutation = useMutation({
    mutationFn: () => {
      //const amount = form.getValues().commitAmount;
      //api.commit(amount)
      return Promise.resolve();
    },
  });

  return (
    <div>
      <Form {...form}>
        <form
          className="flex flex-col items-center space-y-4"
          onSubmit={() => mutation.mutate()}
        >
          <FormField
            name="commitAmount"
            control={form.control}
            render={({ field }) => (
              <TokenAmountInput
                {...field}
                label="Commit Amount"
                disableMaxButton
                showUsdPrice={false}
                //@ts-expect-error TODO: component expects a onchain token, this is a one-off use
                token={{
                  symbol: "USD",
                  chainId: 0,
                  address: zeroAddress as Address,
                }}
              />
            )}
          />
          <Button className="w-full">Commit</Button>
        </form>
      </Form>
    </div>
  );
}
