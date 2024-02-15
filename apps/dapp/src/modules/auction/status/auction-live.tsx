//@ts-nocheck
import { axisContracts } from "@repo/contracts";
import { Button, InfoLabel, trimAddress } from "@repo/ui";
import { useAllowance } from "loaders/use-allowance";
import { useReferral } from "loaders/use-referral";
import React from "react";
import { cloakClient } from "src/services/cloak";
import { Address, formatUnits, parseUnits, toHex } from "viem";
import {
  useAccount,
  useBalance,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { AuctionInputCard } from "../auction-input-card";
import { AuctionBidInput } from "../auction-bid-input";
import { AuctionInfoCard } from "../auction-info-card";
import { PropsWithAuction } from "..";
import { MutationDialog } from "modules/transactions/mutation-dialog";
import { useMutation } from "@tanstack/react-query";
import { LoadingIndicator } from "components/loading-indicator";
import { RequiresWalletConnection } from "components/requires-wallet-connection";
import { LockIcon } from "lucide-react";

export function AuctionLive({ auction }: PropsWithAuction) {
  const account = useAccount();
  const [baseTokenAmount, setBaseTokenAmount] = React.useState<number>(0);
  const [quoteTokenAmount, setQuoteTokenAmount] = React.useState<number>(0);
  const { address } = useAccount(); // TODO add support for different recipient
  const axisAddresses = axisContracts.addresses[auction.chainId];

  const referrer = useReferral();

  const bid = useWriteContract();

  const bidReceipt = useWaitForTransactionReceipt({ hash: bid.data });

  const balance = useBalance({
    address: account.address,
    token: auction.quoteToken.address as Address,
    chainId: auction.chainId,
  });

  const {
    isSufficientAllowance,
    approveTx,
    execute: approveCapacity,
    allowance,
  } = useAllowance({
    ownerAddress: address,
    spenderAddress: axisAddresses.auctionHouse,
    tokenAddress: auction.quoteToken.address as Address,
    decimals: Number(auction.quoteToken.decimals),
    chainId: auction.chainId,
    amount: Number(quoteTokenAmount),
  });

  React.useEffect(() => {
    if (bidReceipt.isSuccess) {
      balance.refetch();
      allowance.refetch();
    }
  }, [bidReceipt.isSuccess]);

  // TODO Permit2 signature

  const bidDependenciesMutation = useMutation({
    mutationFn: async () => {
      const baseTokenAmountOut = parseUnits(
        baseTokenAmount.toString(),
        Number(auction.baseToken.decimals),
      );

      // TODO consider giving a state update on the encryption process
      const encryptedAmountOut = await cloakClient.keysApi.encryptLotIdPost({
        xChainId: auction.chainId,
        xAuctionHouse: axisAddresses.auctionHouse,
        lotId: parseInt(auction.lotId),
        body: toHex(baseTokenAmountOut, "bigint"),
      });

      return encryptedAmountOut;
    },
  });

  const handleBid = async () => {
    // Amount out needs to be a uint256
    const encryptedAmountOut = await bidDependenciesMutation.mutateAsync();

    // Submit the bid to the contract
    bid.writeContract({
      abi: axisContracts.abis.auctionHouse,
      address: axisAddresses.auctionHouse,
      functionName: "bid",
      args: [
        {
          lotId: parseUnits(auction.lotId, 0),
          recipient: address as Address,
          referrer: referrer,
          amount: parseUnits(
            quoteTokenAmount.toString(),
            Number(auction.quoteToken.decimals),
          ),
          auctionData: encryptedAmountOut,
          allowlistProof: toHex(""),
          permit2Data: toHex(""),
        },
      ],
    });
  };

  const handleSubmit = () => {
    isSufficientAllowance ? handleBid() : approveCapacity();
  };

  const formattedBalance = formatUnits(
    balance.data?.value ?? 0n,
    balance.data?.decimals ?? 0,
  );

  const isValidInput = baseTokenAmount && quoteTokenAmount;
  const shouldDisable =
    !isValidInput ||
    approveTx.isLoading ||
    bidReceipt.isLoading ||
    bid.isPending;
  const isWaiting =
    approveTx.isLoading || bidReceipt.isLoading || bid.isPending;

  console.log({ bid, bidReceipt, bidDependenciesMutation });
  // TODO display "waiting" in modal when the tx is waiting to be signed by the user
  return (
    <div className="flex justify-between">
      <div className="w-1/2">
        <AuctionInfoCard>
          <InfoLabel label="Creator" value={trimAddress(auction.owner)} />
          <InfoLabel
            label="Capacity"
            value={`${auction.capacity} ${auction.baseToken.symbol}`}
          />
          <InfoLabel
            label="Minimum Price"
            value={`${auction.minPrice} ${auction.quoteToken.symbol}/${auction.baseToken.symbol}`}
          />
          <InfoLabel
            label="Minimum Quantity"
            value={`${auction.minBidSize} ${auction.quoteToken.symbol}`}
          />
          <InfoLabel label="Total Bids" value={auction.bids.length} />
          <InfoLabel
            label="Total Bid Amount"
            value={`${auction.bids.reduce(
              (total, b) => total + Number(b.amountIn),
              0,
            )} ${auction.quoteToken.symbol}`}
          />
        </AuctionInfoCard>
      </div>

      <div className="w-[40%]">
        <AuctionInputCard
          disabled={shouldDisable}
          auction={auction}
          onClick={handleSubmit}
          submitText={""}
        >
          <>
            <AuctionBidInput
              balance={formattedBalance}
              onChangeAmountIn={(e) => setQuoteTokenAmount(Number(e))}
              onChangeMinAmountOut={(e) => setBaseTokenAmount(Number(e))}
              auction={auction}
            />
            <RequiresWalletConnection className="mt-4">
              <div className="mt-4 w-full">
                {!isSufficientAllowance ? (
                  <Button className="w-full" onClick={() => approveCapacity()}>
                    {isSufficientAllowance ? (
                      "Bid"
                    ) : isWaiting ? (
                      <div className="flex">
                        Waiting for confirmation...
                        <LoadingIndicator />
                      </div>
                    ) : (
                      "Approve"
                    )}
                  </Button>
                ) : (
                  <MutationDialog
                    onConfirm={() => handleBid()}
                    mutation={bidReceipt}
                    chainId={auction.chainId}
                    hash={bid.data}
                    /* @ts-expect-error TODO: remove this expect*/
                    error={bidDependenciesMutation.error}
                    triggerContent={"Bid"}
                    disabled={shouldDisable || isWaiting}
                    //@ts-expect-error make screens optional
                    screens={{
                      idle: {
                        Component: () => (
                          <div className="text-center">
                            You&apos;re about to place a bid of{" "}
                            {quoteTokenAmount} {auction.quoteToken.symbol}
                          </div>
                        ),
                        title: "Confirm Bid",
                      },
                      success: {
                        Component: () => (
                          <div className="flex justify-center text-center">
                            <LockIcon className="mr-1" />
                            Bid encrypted and stored successfully!
                          </div>
                        ),
                        title: "Transaction Confirmed",
                      },
                    }}
                  />
                )}
              </div>
            </RequiresWalletConnection>
          </>
        </AuctionInputCard>

        {/* {bidReceipt.isLoading && <p>Confirming transaction...</p>} */}
        {/* {bid.isError && <p>{bid.error?.message}</p>} */}
        {/* {bidReceipt.isError && <p>{bidReceipt.error?.message}</p>} */}
        {/* {bidReceipt.isSuccess && <p>Success!</p>} */}
      </div>
    </div>
  );
}
