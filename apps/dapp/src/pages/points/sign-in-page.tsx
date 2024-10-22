import { metadata } from "@repo/env";
import { Button, Card, Text } from "@repo/ui";
import { SocialRow } from "components/social-row";
import { ArrowLeftIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useProfile } from "modules/points/hooks/use-profile";
import { PointsHeader } from "modules/points/claim-points-header";
import { useEffect } from "react";
import { useAccount } from "wagmi";

export function SignInPage() {
  const { address } = useAccount();
  const navigate = useNavigate();

  const { signIn, walletPoints } = useProfile();

  useEffect(() => {
    if (address == null) return;
    walletPoints.fetch(address);
  }, [address, walletPoints]);

  const handleSignIn = () => {
    signIn.mutate(undefined, { onSuccess: () => navigate("/profile") });
  };

  return (
    <div className="claim-points-gradient absolute inset-0 z-20 flex h-dvh w-dvw flex-col">
      <img
        src="dot-grid.svg"
        className="absolute inset-0 h-dvh w-dvw object-cover opacity-50"
      />
      <div className="z-30 flex justify-center py-10">
        <img src="images/axis-wordmark.svg" width={99} height={32} />
        <Link
          to="/"
          className="hover:text-surface absolute right-20 flex items-center gap-x-1"
        >
          <ArrowLeftIcon className="duration-150" />
          <Text uppercase mono className="duration-150">
            Back
          </Text>
        </Link>
      </div>

      <div className="z-30 flex h-5/6 items-center justify-center ">
        <Card className="bg-surface w-[384px]">
          <PointsHeader subtitle="Sign In" />

          <Text className="my-4">
            Sign in with Ethereum to see your points.
          </Text>

          <Button
            disabled={signIn.isPending}
            className="mt-3 w-full"
            onClick={handleSignIn}
          >
            {signIn.isPending ? "Signing in..." : "Sign in"}
          </Button>
        </Card>
      </div>
      <div className="z-30 flex justify-center pb-[64px] pt-10">
        <SocialRow className="gap-x-8" iconClassName="size-8" {...metadata} />
      </div>
    </div>
  );
}
