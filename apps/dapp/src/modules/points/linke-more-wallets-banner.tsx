import { useAccount } from "wagmi";
import { Banner } from "@/components";
import { useProfile } from "./hooks/use-profile";
import { useNavigate } from "react-router-dom";

export function LinkMoreWalletsBanner() {
  const { address } = useAccount();
  const { profile } = useProfile();
  const navigate = useNavigate();

  if (
    address == null ||
    profile?.wallets?.some(
      (wallet) => wallet?.address?.toLowerCase() !== address.toLowerCase(),
    )
  )
    return null;

  return (
    <Banner
      title="Leaving extra points on the table?"
      subtitle="Aggregate several wallets into one profile to increase your rewards."
      buttonText="Link more wallets"
      onClick={() => navigate("/points/link-wallet")}
    />
  );
}
