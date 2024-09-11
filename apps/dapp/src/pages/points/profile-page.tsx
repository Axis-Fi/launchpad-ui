import { useAccount } from "wagmi";
import { Profile } from "modules/points/profile";
import { SignIn } from "modules/points/sign-in";
import { useProfile } from "modules/points/hooks/use-profile";

export function ProfilePage() {
  const { isConnected: isWalletConnected } = useAccount();
  const { isUserRegistered, isUserSignedIn } = useProfile();

  if (!isWalletConnected) {
    return <div>Connect your wallet to continue</div>;
  }

  if (!isUserRegistered) {
    return "Claim flow";
    // return <UnregisteredProfile />;
  }

  if (!isUserSignedIn) {
    return <SignIn />;
  }

  return <Profile />;
}
