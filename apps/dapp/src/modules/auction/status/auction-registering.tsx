/* eslint-disable */

import { Card, FormField, Form, Button } from "@repo/ui";
import { PropsWithAuction } from "@repo/types";
import { AuctionCoreMetrics } from "../auction-core-metrics";
import { ProjectInfoCard } from "../project-info-card";
import { TokenInfoCard } from "../token-info-card";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TokenAmountInput } from "modules/token/token-amount-input";
import { Address, zeroAddress } from "viem";
import { useProfile } from "modules/points/hooks/use-profile";
import { useAccount } from "wagmi";
import { useAuctionRegistrations } from "../hooks/use-auction-registrations";

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
  commitAmount: z.coerce.number(),
});

type CommitForm = z.infer<typeof schema>;

function AuctionRegisteringForm(props: PropsWithAuction) {
  const { address } = useAccount();
  const auth = useProfile();
  const registrations = useAuctionRegistrations();

  const form = useForm<CommitForm>({
    mode: "onChange",
    delayError: 600,
    resolver: zodResolver(schema),
  });

  const handleSignIn = () => {
    //TODO: figure out how the auth flow will work
    auth.isUserRegistered ? auth.register.mutate() : auth.signIn.mutate();
  };

  const prepareCommit = () => {
    return {
      commitment: form.getValues().commitAmount,
      walletAddress: address,
      id: Number(props.auction.lotId),
      launchName: props.auction.id,
    };
  };

  const handleCommit = () => registrations.registerDemand(prepareCommit());

  const handleUpdateCommit = () => registrations.updateDemand(prepareCommit());

  const handleCancelCommit = () => registrations.cancelDemand(prepareCommit());

  const isCommited = false;

  return (
    <div>
      <Form {...form}>
        <form className="flex flex-col items-center space-y-4">
          <FormField
            name="commitAmount"
            control={form.control}
            render={({ field }) => (
              <TokenAmountInput
                {...field}
                disableMaxButton
                label="Commit Amount"
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

          {!isCommited ? (
            <Button className="w-full" onClick={handleCommit}>
              Commit
            </Button>
          ) : (
            <div className="flex gap-x-1">
              <Button onClick={handleUpdateCommit}>Update</Button>
              <Button onClick={handleCancelCommit}>Cancel</Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
