import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Profile } from "modules/points/profile";
import { useProfile } from "modules/points/hooks/use-profile";

export function ProfilePage() {
  const { isUserRegistered, isUserSignedIn } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (isUserRegistered.isLoading || isUserSignedIn) return;

    if (!isUserRegistered.data) {
      return navigate("/points/claim");
    }

    if (!isUserSignedIn) {
      return navigate("/points/sign-in");
    }
  }, [isUserRegistered, isUserSignedIn, navigate]);

  return <Profile />;
}
