import { Check, TriangleAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  useToast,
  Text,
} from "@/components";
import { useProfile } from "modules/points/hooks/use-profile";
import { LinkWalletForm } from "modules/points/link-wallet-form";

export function LinkWalletDialog() {
  const navigate = useNavigate();
  const { linkWallet, profile } = useProfile();
  const { toast } = useToast();

  const handeWalletLinked = () => {
    linkWallet.mutate(undefined, {
      onError: (e) => {
        toast({
          variant: "destructive",
          title: (
            <div className="flex items-center gap-x-2">
              <TriangleAlert size="16" /> Failed to link wallet
            </div>
          ),
        });
        console.error({ e });
      },
      onSuccess: () => {
        navigate(-1);

        toast({
          title: (
            <div className="flex items-center gap-x-2">
              <Check size="16" /> Wallet successfully linked
            </div>
          ),
        });
      },
    });
  };

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
        <LinkWalletForm onSubmit={handeWalletLinked} />
      </DialogContent>
    </Dialog>
  );
}
