import { useEffect } from "react";
import { z } from "zod";
import { useParams } from "react-router-dom";
import { useAccount } from "wagmi";
import { useForm } from "react-hook-form";
import { Check, CircleX } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, FormField, Form, Button, useToast, Metric } from "@repo/ui";
import type { Auction, PropsWithAuction } from "@repo/types";
import type {
  LaunchRegistration,
  LaunchRegistrationRequest,
} from "@repo/points";
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
import { generateRandomProfile } from "../utils/generate-random-profile";
import { trimCurrency } from "utils";

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
            <ProjectInfoCard auction={auction!} canRefer={false}>
              {auction.fdv && (
                <Metric size="m" label="FDV" className="mb-sm">
                  ${trimCurrency(auction.fdv)}
                </Metric>
              )}
            </ProjectInfoCard>
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
  const { toast } = useToast();
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
      commitmentAmount: userRegistration?.commitment?.toString() ?? undefined,
    },
  });

  // useForm() can run before the async userRegistration data has resolved
  // so update the form manually when it comes in
  useEffect(() => {
    if (userRegistration) {
      form.reset({
        commitmentAmount: userRegistration.commitment?.toString() ?? undefined,
      });
    }
  }, [userRegistration, form]);

  const responseToasts = {
    onError: () => {
      toast({
        title: (
          <div className="flex items-center gap-x-2">
            <CircleX size="16" /> Committment failed
          </div>
        ),
      });
    },
    onSuccess: () => {
      toast({
        title: (
          <div className="flex items-center gap-x-2">
            <Check size="16" /> Committment successfully saved
          </div>
        ),
      });
    },
  };

  const handleSignIn = () => {
    if (auth.isUserRegistered.data) {
      return auth.signIn.mutate("Sign in to see or make your committment.");
    }

    const profile = generateRandomProfile();

    return auth.register.mutate(
      { profile, statement: "Sign in to see or make your commitment" },
      {
        onSuccess: () => {
          toast({
            title: (
              <div className="flex items-center gap-x-2">
                <Check size="16" /> Sign in successful
              </div>
            ),
          });
        },
      },
    );
  };

  const prepareCommit = (): LaunchRegistrationRequest => {
    return {
      commitment: Number(form.getValues().commitmentAmount ?? 0),
      walletAddress: address,
      launchName: props.auction.info!.name!,
    };
  };

  const prepareUpdate = (): LaunchRegistration => {
    return {
      id: userRegistration?.id,
      commitment: Number(form.getValues().commitmentAmount ?? 0),
      walletAddress: address,
      launchName: props.auction.info!.name!,
    };
  };

  const handleSubmitCommit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!auth.isUserSignedIn) return handleSignIn();

    registerDemand(prepareCommit(), responseToasts);
  };

  const handleUpdateCommit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!auth.isUserSignedIn) return handleSignIn();

    updateDemand(prepareUpdate(), responseToasts);
  };

  const handleCancelCommit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!auth.isUserSignedIn) return handleSignIn();

    cancelDemand(prepareUpdate(), {
      onSuccess: () => {
        form.reset({
          commitmentAmount: undefined,
        });
        responseToasts.onSuccess?.();
      },
      onError: responseToasts.onError,
    });
  };

  const hasUserCommitted = userRegistration != null;

  return (
    <div>
      <Form {...form}>
        <form className="flex flex-col items-center space-y-4">
          {auth.isUserSignedIn && (
            <FormField
              name="commitmentAmount"
              control={form.control}
              render={({ field }) => (
                <TokenAmountInput
                  {...field}
                  disableMaxButton
                  label="Commitment amount"
                  showUsdPrice={false}
                  tokenLabel="USD"
                  amountPrefix="$"
                />
              )}
            />
          )}

          {!auth.isUserSignedIn && (
            <Button className="w-full" onClick={handleSignIn}>
              Sign in
            </Button>
          )}

          {auth.isUserSignedIn && !hasUserCommitted && (
            <Button className="w-full" onClick={handleSubmitCommit}>
              Submit
            </Button>
          )}
          {auth.isUserSignedIn && hasUserCommitted && (
            <div className="gap-y-sm flex w-full flex-col">
              <Button variant="secondary" onClick={handleCancelCommit}>
                Cancel committment
              </Button>
              <Button onClick={handleUpdateCommit}>Update commitment</Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
