import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Button, Card, useToast } from "@repo/ui";
import { trimCurrency } from "utils/currency";
import { PointsHeader } from "../claim-points-header";
import { ConnectedWallet } from "../connected-wallet";
import { useProfile } from "../hooks/use-profile";
import { useWizard } from "react-use-wizard";
import { ShareRefLinkButton } from "modules/referral/share-ref-link-button";

export function ViewPointsStep() {
  const { profile } = useProfile();
  const { toast } = useToast();
  const wizard = useWizard();

  const totalPoints = profile?.points?._0?.totalPoints ?? 0;

  useEffect(() => {
    toast({
      title: (
        <div className="flex items-center gap-x-2">
          <Check size="16" /> Profile successfully created
        </div>
      ),
      description: "Refer your friends to claim more points!",
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Card className="bg-surface w-full">
      <PointsHeader subtitle={`${trimCurrency(totalPoints)} points claimed`} />
      <img src="points-logo.png" className="mx-auto my-8 size-[200px]" />

      <div className="mb-6">
        <ConnectedWallet />
      </div>

      <div className="gap-y-sm flex flex-col items-center *:w-full">
        <Button asChild>
          <Link to="/points">View Profile</Link>
        </Button>
        <Button variant="secondary" onClick={wizard.nextStep}>
          Link Wallets to combine Points
        </Button>
        <ShareRefLinkButton />
      </div>
    </Card>
  );
}
