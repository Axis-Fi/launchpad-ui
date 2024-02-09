import { Button } from "@repo/ui";
import type { Auction } from "src/types";
import { useDecryptBids } from "../use-decrypt-bids";

export function AuctionConcluded({ auction }: { auction: Auction }) {
  const decrypt = useDecryptBids(auction);

  return (
    <div className="flex justify-center">
      <Button onClick={decrypt.handleDecryption}>Decrypt Bids</Button>
      {decrypt.decryptReceipt.isLoading && <p>Pending ... </p>}
      {decrypt.decryptReceipt.isSuccess && <p>Bids decrypted!</p>}
    </div>
  );
}
