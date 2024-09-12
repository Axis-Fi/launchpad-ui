import { Profile } from "modules/points/profile";
import { SignIn } from "modules/points/sign-in";
import { useProfile } from "modules/points/hooks/use-profile";
import { ClaimPointsPage } from "./claim-points-page";

export function ProfilePage() {
  const { isUserRegistered, isUserSignedIn } = useProfile();

  if (!isUserRegistered) {
    return <ClaimPointsPage />;
  }

  if (!isUserSignedIn) {
    return <SignIn />;
  }

  return <Profile />;
}
