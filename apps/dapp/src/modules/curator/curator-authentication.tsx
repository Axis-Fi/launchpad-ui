import { Button, Card, Text } from "@repo/ui";
import { useVerifyTwitter } from "modules/auction/hooks/use-verify-twitter";

export function CuratorAuthentication() {
  const twitter = useVerifyTwitter();

  return (
    <div className="mx-auto mt-20 max-w-[400px]">
      <Card className="flex  justify-center">
        <div className="flex flex-col items-center justify-center">
          <Button onClick={() => twitter.redirectToVerify()}>
            Authenticate with X/Twitter
          </Button>
          <Text size="sm" className="mt-4 text-center">
            In order to create a profile you first need to authenticate.
            We&apos;re using X/Twitter Authentication to verify your identity
          </Text>
        </div>
      </Card>
    </div>
  );
}
