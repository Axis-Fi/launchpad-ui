import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Text } from "@repo/ui";
import { useVerifyTwitter } from "modules/auction/hooks/use-verify-twitter";

export function CuratorAuthentication() {
  const twitter = useVerifyTwitter();
  const navigate = useNavigate();

  useEffect(() => {
    if (!twitter.isLoading && twitter.isVerified) {
      navigate("/curator-verified");
    }
  }, [navigate, twitter.isLoading, twitter.isVerified]);

  return (
    <div className="mx-auto mt-20 max-w-[400px]">
      <Card className="flex  justify-center">
        <div className="flex flex-col items-center justify-center">
          <Button onClick={() => twitter.redirectToVerify()}>
            Authenticate with X
          </Button>
          <Text size="sm" className="mt-4 text-center">
            Curator profiles&apos; are associated with an X account to prevent
            fake profiles.
            <br />
            Please authenticate with your X account to continue.
          </Text>
        </div>
      </Card>
    </div>
  );
}
