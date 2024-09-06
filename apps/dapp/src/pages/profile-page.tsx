import { Profile } from "modules/points/profile";

export function ProfilePage() {
  const isWalletConnected = true;

  if (!isWalletConnected) {
    return <div>Connect your wallet to continue</div>;
  }

  return <Profile />;
}
