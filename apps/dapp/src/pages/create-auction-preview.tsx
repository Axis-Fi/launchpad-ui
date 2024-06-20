import {
  Button,
  Text,
  DialogContent,
  DialogRoot,
  Tabs as TabsRoot,
  TabsTrigger as Trigger,
  TabsList,
  TabsContent,
} from "@repo/ui";
import { AuctionPageView } from "./auction-page";
import { CreateAuctionForm } from "./create-auction-page";
import { Auction, AuctionType, Token } from "@repo/types";
import { AuctionLivePreview } from "modules/auction/status/auction-preview";
import React from "react";
import { useFormContext } from "react-hook-form";
import { formatUnits } from "viem";
import { AuctionCard } from "modules/auction/auction-card";
import { getDuration } from "utils/date";
import { addMilliseconds } from "date-fns";

type CreateAuctionPreviewProps = {
  chainId: number;
  open?: boolean;
  onOpenChange: (open: boolean) => void;
  initiateCreateTx: () => void;
};

export function CreateAuctionPreview(props: CreateAuctionPreviewProps) {
  const form = useFormContext<CreateAuctionForm>();

  const auction = React.useMemo(() => {
    if (!form.formState.isValid) return;
    return {
      ...deriveAuctionFromCreationParams(form.getValues()),
      chainId: props.chainId,
    };
  }, [props.chainId, form.formState]);

  if (!auction) return;

  return (
    <DialogRoot
      open={props.open}
      onOpenChange={(open) => props.onOpenChange(open)}
    >
      <DialogContent className="bg-surface-tertiary/50 max-h-screen max-w-screen-2xl overflow-y-scroll backdrop-blur">
        <div>
          <Text
            size="3xl"
            mono
            className="text-surface-primary mx-auto mb-2 w-min text-nowrap"
          >
            Auction Preview
          </Text>
          <TabsRoot defaultValue="page" className="flex flex-col items-center">
            <TabsList className="gap-x-1 *:z-10 *:px-8">
              <Trigger value="page">Page</Trigger>
              <Trigger value="list">List</Trigger>
              <Trigger value="grid">Grid</Trigger>
            </TabsList>
            <div className="-mt-8 flex flex-col items-center justify-center p-4">
              <TabsContent value="page" className="bg-background p-4">
                <AuctionPageView auction={auction}>
                  <AuctionLivePreview auction={auction} />
                </AuctionPageView>
              </TabsContent>
              <TabsContent value="list" className="bg-background p-4">
                <AuctionCard
                  disabledViewButton
                  auction={auction}
                  className="w-[1300px]"
                />
              </TabsContent>
              <TabsContent value="grid" className="bg-background p-4">
                <div className="max-h-[400px] max-w-[470px]">
                  <AuctionCard
                    disabledViewButton
                    isGrid={true}
                    auction={auction}
                  />
                </div>
              </TabsContent>
            </div>
          </TabsRoot>
        </div>
        <div className="flex justify-center gap-x-6">
          <Button
            size="lg"
            variant="secondary"
            className="bg-background border-transparent"
            onClick={(e) => {
              e.preventDefault();
              props.onOpenChange(false);
            }}
          >
            Change Configuration
          </Button>
          <Button
            size="lg"
            onClick={(e) => {
              e.preventDefault();
              props.onOpenChange(false);
              props.initiateCreateTx();
            }}
          >
            Create This Auction
          </Button>
        </div>
      </DialogContent>
    </DialogRoot>
  );
}

/**
 * Gets a partial Auction from auction creation params
 * */
function deriveAuctionFromCreationParams(params: CreateAuctionForm): Auction {
  const supply = formatUnits(
    params.payoutToken.totalSupply ?? 0n,
    params.payoutToken.decimals,
  );

  return {
    status: "live",
    auctionType: params.auctionType as AuctionType,
    capacity: params.capacity,
    capacityInitial: params.capacity,
    quoteToken: params.quoteToken as Token,
    baseToken: { ...params.payoutToken, totalSupply: supply } as Token,
    conclusion: params.deadline.getTime().toString(),
    //@ts-expect-error TODO: fix type mismatch
    linearVesting: params.isVested
      ? {
          id: "420",
          startTimestamp:
            params.vestingStart?.getTime().toString() ??
            params.deadline.getTime(),
          expiryTimestamp:
            params.deadline.getTime() +
            getDuration(Number(params.vestingDuration)),
          startDate: params.vestingStart ?? params.start,
          expiryDate: addMilliseconds(
            params.deadline,
            getDuration(Number(params.vestingDuration)),
          ),
        }
      : undefined,

    auctionInfo: {
      name: params.name,
      description: params.description,
      tagline: params.tagline,
      links: {
        payoutTokenLogo: params.payoutTokenLogo,
        projectLogo: params.projectLogo,
        projectBanner: params.projectBanner,
        discord: params.discord,
        website: params.website,
        farcaster: params.farcaster,
        twitter: params.twitter,
      },
    },
    //@ts-expect-error intentionally imcomplete
    encryptedMarginalPrice: {
      minPrice: params.minPrice!,
      minFilled: (
        Number(params.capacity) * Number(params.minFillPercent?.[0] ?? 1 / 100)
      ).toString(),
    },
    //@ts-expect-error intentionally imcomplete
    fixedPrice: {
      price: params.price!,
    },
    dtl: {
      proceedsPercent: params.dtlProceedsPercent,
    },
  };
}
