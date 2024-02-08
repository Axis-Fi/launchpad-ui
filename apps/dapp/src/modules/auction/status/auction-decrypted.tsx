import { axisContracts } from "@repo/contracts";
import { Button } from "@repo/ui";
import { Auction } from "src/types";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

export function AuctionDecrypted({ auction }: { auction: Auction }) {
  const contract = axisContracts[auction.chainId];
  const decrypt = useWriteContract();
  const decryptReceipt = useWaitForTransactionReceipt({ hash: decrypt.data });

  const isLoading = decrypt.isPending || decryptReceipt.isLoading;

  const handleDecryption = () => {
    decrypt.writeContract({
      address: contract.auctionHouse.address,
      //@ts-expect-error abi is blank
      abi: contract.auctionHouse.abi,
      //TODO: implement call
    });
  };

  return (
    <div className="flex justify-center">
      <Button onClick={handleDecryption}>Settle Auction</Button>

      {isLoading && <p>Loading... </p>}
      {decrypt.isError && <p>{decrypt.error?.message}</p>}
      {decryptReceipt.isSuccess && <p>Success!</p>}
    </div>
  );
}
