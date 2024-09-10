import { Profile } from "modules/points/profile";
import { usePoints } from "context/points-provider";
import { UnregisteredProfile } from "modules/points/unregistered-profile";
import { SignIn } from "modules/points/sign-in";

export function ProfilePage() {
  const isWalletConnected = true;
  const { isRegistered, isAuthenticated } = usePoints();

  console.log("isRegistered", isRegistered);
  console.log("isAuthenticated", isAuthenticated);

  if (!isWalletConnected) {
    return <div>Connect your wallet to continue</div>;
  }

  if (!isRegistered) {
    return <UnregisteredProfile />;
  }

  if (!isAuthenticated) {
    return <SignIn />;
  }

  return <Profile />;
}
