import {
  Button,
  InfoLabel,
  cn,
  type
  InfoLabelProps,
  ToggleProvider,
  useToggle,
} from "@repo/ui";
import { AuctionInfoCard } from "../auction-info-card";
import { AuctionInputCard } from "../auction-input-card";
import { AuctionType, type EMPAuctionData, type PropsWithAuction } from "@repo/types";
import { SettledAuctionChart } from "modules/auction/settled-auction-chart";
import { ProjectInfoCard } from "../project-info-card";
import { useClaimProceeds } from "../hooks/use-claim-proceeds";
import { useAccount, useChainId } from "wagmi";
import { useClaimBids } from "../hooks/use-claim-bids";
import { RequiresChain } from "components/requires-chain";
import { AuctionInfoLabel } from "../auction-info-labels";
import { TransactionDialog } from "modules/transaction/transaction-dialog";
import React from "react";
import { trimCurrency } from "utils/currency";
import { useTokenPrice } from "../hooks/use-token-price";
import { formatUnits } from "viem";

type ToggledAmountProps = {
   symbol: string;
   amount: number | string;
} & Omit<InfoLabelProps, "value">;

const ToggledAmount = ({ symbol, amount, ...rest }: ToggledAmountProps) => {
  const chainId = useChainId();
  const price = useTokenPrice(chainId, symbol);
  const { isToggled: isUsdEnabled } = useToggle();

  const value = isUsdEnabled && price !== undefined
    ?`$${trimCurrency(price * Number(amount))}`
    : `${trimCurrency(amount)} ${symbol}`;

  return <InfoLabel {...rest} value={value} />;
}

const AuctionHeader = ({ auction }: PropsWithAuction) => {
  const clearingPrice = Number(formatUnits(
    (auction?.auctionData as EMPAuctionData)?.marginalPrice ?? 0,
    Number(auction.quoteToken.decimals),
  ));
  const fdv = (Number(auction.baseToken.totalSupply) ?? 0) * clearingPrice;

  return (
    <div className="flex justify-between items-start mb-4">
      <ToggledAmount
        reverse={true}
        label="Clearing price"
        symbol={auction.quoteToken.symbol}
        amount={clearingPrice}
      />
      <ToggledAmount
        reverse={true}
        label="Total Raised"
        symbol={auction.quoteToken.symbol}
        amount={auction?.purchased ?? 0}
      />
      <ToggledAmount
        reverse={true}
        label="FDV"
        symbol={auction.quoteToken.symbol}
        amount={fdv ?? 0}
      />
      <InfoLabel
        reverse={true}
        label="Participants"
        value={auction.formatted?.uniqueBidders}
      />
    </div>
  )
}

const UsdSwitch: React.FC<{ currencySymbol: string }>  = ({ currencySymbol }) => {
  const { isToggled, toggle } = useToggle();

  return (
    <div className="flex items-center ghost">
      <Button variant={isToggled ? "secondary" : "ghost"} size="sm" className="mr-2" onClick={toggle}>USD</Button>
      <Button variant={isToggled ? "ghost" : "secondary"} size="sm" className="mr-2" onClick={toggle}>{currencySymbol}</Button>
    </div>
  );
}

export function AuctionSettled({ auction }: PropsWithAuction) {
  const [isClaimBids, setIsClaimingBids] = React.useState(false);
  const [isClaimingProceeds, setIsClaimingProceeds] = React.useState(false);
  
  const { address } = useAccount();
  const isEMP = auction.auctionType === AuctionType.SEALED_BID;
  const claimProceeds = useClaimProceeds(auction);
  const claimBids = useClaimBids(auction);
  const userHasBids = auction.bids.some(
    (b) => b.bidder.toLowerCase() === address?.toLowerCase(),
  );

  return (
    <div className="w-full">
      <div className="mb-8 flex justify-between">
        {isEMP && (
          <div className="w-[60%] mx-8">
            <ToggleProvider>
              <AuctionHeader auction={auction} />
              <div className="flex justify-start">
                <UsdSwitch currencySymbol={auction.quoteToken.symbol} />
              </div>
              <SettledAuctionChart
                lotId={auction.lotId}
                chainId={auction.chainId}
              />
            </ToggleProvider>
          </div>
        )}
        <div className={cn("w-[40%]", !isEMP && "w-full")}>
          <AuctionInputCard submitText={""} auction={auction}>
            <div className="text-center">
              <h4>Payout for this auction has been distributed!</h4>
            </div>
            <RequiresChain chainId={auction.chainId}>
              {address?.toLowerCase() === auction.owner.toLowerCase() && (
                <div className="flex justify-center">
                  <Button
                    onClick={() => setIsClaimingProceeds(true)}
                    className="mt-4"
                  >
                    CLAIM PROCEEDS
                  </Button>
                </div>
              )}
              {userHasBids && (
                <div className="flex justify-center">
                  <Button
                    onClick={() => setIsClaimingBids(true)}
                    className="mt-4"
                  >
                    CLAIM BIDS
                  </Button>
                </div>
              )}
            </RequiresChain>
          </AuctionInputCard>
        </div>
      </div>
      <div className="flex justify-between">
        <AuctionInfoCard>
          <InfoLabel
            label="Total Raised"
            value={`${auction.formatted?.purchased} ${auction.quoteToken.symbol}`}
          />

          <InfoLabel label="Total Bids" value={auction.bids.length} />
          <InfoLabel
            label="Unique Participants"
            value={auction.formatted?.uniqueBidders}
          />

          <InfoLabel label="Ended" value={auction.formatted?.endFormatted} />
          <AuctionInfoLabel auction={auction} id="vestingDuration" />
        </AuctionInfoCard>
        <div className="w-1/2">
          <ProjectInfoCard auction={auction} />
        </div>
      </div>
      <TransactionDialog
        signatureMutation={claimBids.claimTx}
        mutation={claimBids.claimReceipt}
        chainId={auction.chainId}
        hash={claimBids.claimTx.data!}
        onConfirm={claimBids.handleClaim}
        open={isClaimBids}
        onOpenChange={(open) => {
          setIsClaimingBids(open);

          if (claimBids.claimTx.isError) {
            claimBids.claimTx.reset();
          }
        }}
      />
      <TransactionDialog
        signatureMutation={claimProceeds.claimTx}
        mutation={claimProceeds.claimReceipt}
        chainId={auction.chainId}
        hash={claimProceeds.claimTx.data!}
        onConfirm={claimProceeds.handleClaim}
        open={isClaimingProceeds}
        onOpenChange={(open) => {
          setIsClaimingBids(open);

          if (claimProceeds.claimTx.isError) {
            claimProceeds.claimTx.reset();
          }
        }}
      />
    </div>
  );
}
