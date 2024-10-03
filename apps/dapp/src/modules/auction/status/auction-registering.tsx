import { z } from "zod";
import { useParams } from "react-router-dom";
import { useAccount } from "wagmi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, FormField, Form, Button } from "@repo/ui";
import type { Auction, PropsWithAuction } from "@repo/types";
import type { LaunchRegistration } from "@repo/points";
import { ProjectInfoCard } from "../project-info-card";
import { TokenAmountInput } from "modules/token/token-amount-input";
import { useProfile } from "modules/points/hooks/use-profile";
import { useAuctionRegistrations } from "../hooks/use-auction-registrations";
import { PageContainer } from "modules/app/page-container";
import { PageHeader } from "modules/app/page-header";
import {
  AuctionPageLoading,
  AuctionPageMissing,
  AuctionPageView,
} from "pages/auction-page";
import { generateRandomProfile } from "../utils/generate-randon-profile";

export function AuctionRegistering() {
  const { chainId, lotId } = useParams();
  const { isUserRegistered } = useProfile();
  const { getRegistrationLaunch, activeRegistrations } =
    useAuctionRegistrations();

  const auction = getRegistrationLaunch(lotId, Number(chainId)) as
    | Auction
    | undefined;

  const isLoading = activeRegistrations.isLoading || isUserRegistered.isLoading;

  if (isLoading) {
    return <AuctionPageLoading />;
  }

  if (auction == null) {
    return <AuctionPageMissing />;
  }

  return (
    <PageContainer id="__AXIS_ORIGIN_LAUNCH_PAGE__" className="mb-20">
      <PageHeader backNavigationPath="/#" backNavigationText="Back to Launches">
        {/* <ReloadButton refetching={isRefetching} onClick={() => refetch?.()} /> */}
      </PageHeader>

      <AuctionPageView auction={auction!} isAuctionLoading={isLoading}>
        <div className="auction-action-container h-full items-stretch gap-x-4 lg:flex">
          <div className="space-y-4 lg:w-2/3">
            <ProjectInfoCard auction={auction!} canRefer={false} />
          </div>
          <div className="items-strech h-full lg:w-1/3">
            <Card title="Register your interest">
              <AuctionRegisteringForm auction={auction!} />
            </Card>
          </div>
        </div>
      </AuctionPageView>
    </PageContainer>
  );
}

const schema = z.object({ commitmentAmount: z.string() });

type CommitForm = z.infer<typeof schema>;

function AuctionRegisteringForm(props: PropsWithAuction) {
  const { address } = useAccount();
  const auth = useProfile();
  const { registerDemand, updateDemand, cancelDemand, userRegistrations } =
    useAuctionRegistrations();

  const userRegistration = userRegistrations.data?.find(
    (r) => r.launchName === props.auction.info?.name,
  );

  const form = useForm<CommitForm>({
    mode: "onChange",
    delayError: 600,
    resolver: zodResolver(schema),
    defaultValues: {
      commitmentAmount: (userRegistration?.commitment ?? 0).toString(),
    },
  });

  const handleSignIn = () => {
    if (auth.isUserRegistered.data) {
      return auth.signIn.mutate(undefined, {
        onSuccess: () => registerDemand(prepareCommit()),
      });
    }

    const profile = generateRandomProfile();
    return auth.register.mutate(profile);
  };

  const prepareCommit = (): LaunchRegistration => {
    return {
      commitment: Number(form.getValues().commitmentAmount ?? 0),
      walletAddress: address,
      // id: props.auction.lotId, TODO: what is id?
      launchName: props.auction.info!.name!,
    };
  };

  const handleSubmitCommit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!auth.isUserSignedIn) return handleSignIn();
    registerDemand(prepareCommit());
  };

  const handleUpdateCommit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    updateDemand(prepareCommit());
  };

  const handleCancelCommit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    cancelDemand(prepareCommit());
  };

  const userHasCommitted = userRegistration != null;

  return (
    <div>
      <Form {...form}>
        <form className="flex flex-col items-center space-y-4">
          <FormField
            name="commitmentAmount"
            control={form.control}
            render={({ field }) => (
              <TokenAmountInput
                {...field}
                disableMaxButton
                label="Commitment amount"
                showUsdPrice={false}
              />
            )}
          />

          {userHasCommitted && (
            <Button className="w-full" onClick={handleSubmitCommit}>
              Commit
            </Button>
          )}
          {!userHasCommitted && (
            <div className="flex w-full gap-x-1">
              <Button
                className="flex-1"
                variant="secondary"
                onClick={handleCancelCommit}
              >
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleUpdateCommit}>
                Update
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
