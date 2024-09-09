import { useAccount } from "wagmi";
import { mockProfile } from "./profile";

export function useProfile() {
  const { isConnected } = useAccount();
  const isSignedIn = isConnected && true;
  const isRegistered = true;

  return {
    isSignedIn,
    isRegistered,
    showProfile: isRegistered && isSignedIn,
    profile: mockProfile,
  };
}
