import { featureToggles } from "@repo/env";
import ConnectButton from "../../components/connect-button";

export function UserProfile() {
  const isSignedIn = true;

  if (!featureToggles.POINTS_PHASE_1) {
    return <ConnectButton className="hidden md:block" size="md" />;
  }

  return (
    // TODO: make this component link to the user's profile page
    <div className="flex flex-col items-start justify-center">
      {isSignedIn && (
        <>
          <div className="flex flex-row items-center gap-x-2">
            <img
              className="max-h-[24px] max-w-[24px] rounded-full"
              src="/placeholder-img.jpg"
              alt="user profile"
            />
            0xHarry
          </div>
        </>
      )}
      <ConnectButton className="hidden md:block" size="md" />
    </div>
  );
}
