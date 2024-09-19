import React from "react";
import { ArrowLeftIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { metadata } from "@repo/env";
import { Text, cn } from "@repo/ui";
import { SocialRow } from "components/social-row";
import { ClaimPointsWizard } from "modules/points/claim-points-wizard";
import { useProfile } from "modules/points/hooks/use-profile";
import { useMediaQueries } from "loaders/use-media-queries";

export function ClaimPointsPage() {
  const { isUserRegistered, isUserSignedIn } = useProfile();
  const navigate = useNavigate();
  const [isAtTop, setIsAtTop] = React.useState(false);
  const { isTabletOrMobile } = useMediaQueries();

  React.useEffect(() => {
    //Trigger animation
    if (isTabletOrMobile) return setIsAtTop(true);

    setTimeout(() => setIsAtTop(true), 3000);
  }, []);

  React.useEffect(() => {
    if (isUserRegistered.isLoading) return;
    if (isUserRegistered.data && !isUserSignedIn) {
      navigate("/points/sign-in");
    }
  }, [
    isUserRegistered.isLoading,
    isUserRegistered.data,
    navigate,
    isUserSignedIn,
  ]);

  return (
    <div
      className={cn(
        "claim-points-gradient absolute inset-0 z-20 flex h-dvh w-dvw flex-col overflow-hidden",
        !isAtTop && "cursor-pointer",
      )}
      onClick={() => setIsAtTop(true)}
    >
      <img
        src="dot-grid.svg"
        className="absolute inset-0 h-dvh w-dvw object-cover opacity-50"
      />
      <div className="relative z-30 flex justify-center pt-10">
        <Link
          to="/"
          className={cn(
            "hover:text-surface absolute right-20 flex items-center gap-x-1",
            !isAtTop && "hidden",
            isTabletOrMobile && "right-4",
          )}
        >
          <ArrowLeftIcon className="duration-150" />
          <Text uppercase mono className="duration-150">
            Back
          </Text>
        </Link>
      </div>
      <div
        className="absolute flex h-screen w-full items-center justify-center"
        onClick={() => setIsAtTop(true)}
      >
        <Text
          className={cn(
            "relative right-[110px] top-[30px] text-[50px] font-extralight transition-all duration-1000",
            isAtTop && "-translate-x-[270%] opacity-0",
            isTabletOrMobile && "hidden",
          )}
          mono
        >
          <span>Welcome&nbsp;</span>
          <span>to&nbsp;</span>
        </Text>
        <Text
          className={cn(
            "relative left-[154px] top-[30px] text-[50px] font-extralight transition-all duration-1000",
            isAtTop && "-translate-x-[400%] text-[32px]",

            isTabletOrMobile && "hidden",
          )}
          mono
        >
          Points{" "}
          <span className={cn("opacity-0", isAtTop && "opacity-100")}>
            Claim
          </span>
        </Text>

        <div
          onClick={() => setIsAtTop(true)}
          className={`absolute ${
            isAtTop ? "top-0 pt-10" : "top-1/2"
          } -translate-x-1/2 transform transition-all duration-1000`}
          style={{ left: "50%" }}
        >
          <img
            src="images/axis-wordmark.svg"
            className={cn(
              "h-[64px] w-[199px] transition-all duration-1000",
              isAtTop && "h-8 w-[99px]",
            )}
          />
        </div>
      </div>
      <div
        className={cn(
          "mt-8 flex h-5/6 items-center justify-center",
          isAtTop && "z-30",
        )}
      >
        <div
          className={cn(
            "opacity-0 transition-all delay-300 duration-500",
            isAtTop && "opacity-100",
          )}
        >
          <ClaimPointsWizard />
        </div>
      </div>
      <div className="z-30 flex justify-center pb-[64px]">
        <SocialRow className="gap-x-8" iconClassName="size-8" {...metadata} />
      </div>
    </div>
  );
}
