import { Dialog, DialogContent, DialogHeader } from "@repo/ui";
import { useNavigate } from "react-router-dom";
import { ReferralLinkCard } from "./referral-link-card";

export function ReferralLinkDialog() {
  const navigate = useNavigate();
  return (
    <Dialog open={true} externalDialog onOpenChange={() => navigate(-1)}>
      <DialogContent className="bg-surface">
        <DialogHeader>Refer Origin</DialogHeader>
        <ReferralLinkCard />
      </DialogContent>
    </Dialog>
  );
}
