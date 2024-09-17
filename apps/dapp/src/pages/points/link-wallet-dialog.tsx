import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, Text } from "@/components";
import { useProfile } from "modules/points/hooks/use-profile";
import { LinkWalletForm } from "modules/points/link-wallet-form";

export function LinkWalletDialog() {
  const { profile } = useProfile();
  const navigate = useNavigate();

  if (profile == null) return null;

  return (
    <Dialog open={true} onOpenChange={() => navigate(-1)} externalDialog>
      <DialogContent className="bg-surface sm:max-w-[576px]">
        <DialogHeader className="items-start">
          <Text
            mono
            size="sm"
            uppercase
            className="leading-none tracking-[0.1em]"
          >
            Link wallet
          </Text>
        </DialogHeader>
        <LinkWalletForm onSuccess={() => navigate(-1)} />
      </DialogContent>
    </Dialog>
  );
}
