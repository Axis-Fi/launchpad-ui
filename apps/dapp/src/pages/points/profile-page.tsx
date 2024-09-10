import { Profile } from "modules/points/profile";
import { useAuth } from "context/auth-provider";
import { UnregisteredProfile } from "modules/points/unregistered-profile";

export function ProfilePage() {
  const isWalletConnected = true;
  const { isRegistered } = useAuth();

  if (!isWalletConnected) {
    return <div>Connect your wallet to continue</div>;
  }

  if (!isRegistered) {
    return <UnregisteredProfile />;
  }

  return <Profile />;
}
