import { Button } from "@repo/ui";
import { Auction } from "src/types";

export function AuctionConcluded({ auction }: { auction: Auction }) {
  const handleDecryption = () => {
    auction;
  };

  return (
    <div className="flex justify-center">
      <Button onClick={handleDecryption}>Decrypt Bids</Button>
    </div>
  );
}
