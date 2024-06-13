import {
  Button,
  Text,
  Chip,
  DialogContent,
  DialogRoot,
  ToggleGroup,
  ToggleGroupItem,
} from "@repo/ui";
import { AuctionPageView } from "./auction-page";
import { CreateAuctionForm } from "./create-auction-page";
import { Auction, AuctionType, Token } from "@repo/types";
import { AuctionLivePreview } from "modules/auction/status/auction-preview";
import React from "react";
import { useFormContext } from "react-hook-form";
import { formatUnits } from "viem";
import { AuctionCard } from "modules/auction/auction-card";

type CreateAuctionPreviewProps = {
  chainId: number;
  open?: boolean;
  onOpenChange: (open: boolean) => void;
  initiateCreateTx: () => void;
};

type PreviewViews = "page" | "list" | "grid";

export function CreateAuctionPreview(props: CreateAuctionPreviewProps) {
  const form = useFormContext<CreateAuctionForm>();
  const [currentView, setCurrentView] = React.useState<PreviewViews>("page");

  //TODO: might not be necessary after resolving infinite create page rerender
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
      <DialogContent className="bg-surface-tertiary/50 max-w-screen-2xl backdrop-blur">
        <div className="flex justify-around">
          <Text size="3xl">Auction Preview</Text>
          <ToggleGroup
            type="single"
            onValueChange={(value: PreviewViews) => setCurrentView(value)}
          >
            <ToggleGroupItem value="page">
              <Chip variant={currentView === "page" ? "active" : "filled"}>
                Auction
              </Chip>
            </ToggleGroupItem>

            <ToggleGroupItem value="list">
              <Chip variant={currentView === "list" ? "active" : "filled"}>
                List
              </Chip>{" "}
            </ToggleGroupItem>

            <ToggleGroupItem value="grid">
              <Chip variant={currentView === "grid" ? "active" : "filled"}>
                Card
              </Chip>{" "}
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="bg-background p-4">
          {currentView === "page" && (
            <AuctionPageView auction={auction}>
              <AuctionLivePreview auction={auction} />
            </AuctionPageView>
          )}{" "}
          {currentView === "list" && <AuctionCard auction={auction} />}
          {currentView === "grid" && (
            <div className="mx-auto max-w-[470px]">
              <AuctionCard isGrid={true} auction={auction} />
            </div>
          )}
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
      },
    },
    //@ts-expect-error intentionally imcomplete
    encryptedMarginalPrice: {
      minPrice: params.minPrice!,
    },
    //@ts-expect-error intentional imcomplete
    fixedPrice: {
      price: params.price!,
    },
  };
}
