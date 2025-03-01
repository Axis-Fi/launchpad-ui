import { useAccount } from "wagmi";
import { Link, Button } from "@/components";

export function ShareRefLinkButton({ tweetUrl }: { tweetUrl?: string }) {
  const { address } = useAccount();

  return (
    <Button disabled={address == null} variant="secondary" asChild>
      <Link href={tweetUrl} className="gap-x-sm flex items-center">
        Share link on
        <img src="/images/x-logo.svg" className="inline h-[16px] w-[16px]" />
      </Link>
    </Button>
  );
}
