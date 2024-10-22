import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components";
import { useProfile } from "modules/points/hooks/use-profile";
import { LinkWalletForm } from "modules/points/link-wallet-form";
import { PointsHeader } from "modules/points/claim-points-header";

export function LinkWalletDialog() {
  const { profile } = useProfile();
  const navigate = useNavigate();

  if (profile == null) return null;

  return (
    <Dialog open={true} onOpenChange={() => navigate(-1)} externalDialog>
      <DialogContent className="bg-surface sm:max-w-[576px]">
        <div className="flex justify-between">
          <div className="w-1/3">
            <img src="/points-logo.png" className="size-[120px]" />
          </div>
          <PointsHeader subtitle="Link Wallets" className="w-2/3" />
        </div>
        <LinkWalletForm onSuccess={() => navigate(-1)} />
      </DialogContent>
    </Dialog>
  );
}
