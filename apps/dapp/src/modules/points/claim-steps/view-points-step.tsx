import { Button, Card } from "@repo/ui";
import { trimCurrency } from "utils/currency";
import { Link } from "react-router-dom";
import { ClaimPointsHeader } from "./claim-points-header";
import { ConnectedWallet } from "../connected-wallet";
import { useProfile } from "../hooks/use-profile";

export function ViewPointsStep() {
  const { profile } = useProfile();
  const totalPoints = profile?.points?._0?.totalPoints ?? 0;

  return (
    <Card className="bg-surface w-full">
      <ClaimPointsHeader
        subtitle={`${trimCurrency(totalPoints)} points claimed`}
      />
      <img src="points-logo.png" className="mx-auto my-8 size-[200px]" />

      <div className="mb-6">
        <ConnectedWallet />
      </div>

      <div className="gap-y-sm flex flex-col items-center *:w-full">
        <Button asChild>
          <Link to="/points">View Profile</Link>
        </Button>
        <Button variant="secondary">Link Wallets to combine Points</Button>
      </div>
    </Card>
  );
}
