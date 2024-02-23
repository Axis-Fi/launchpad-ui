import metadata from "config/metadata";
import { DiscordLogoIcon, Link, cn } from "@repo/ui";

/**Shows a message with a link to Discord*/
export function ReachOutMessage({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <div className={cn("flex gap-x-1", className)} {...props}>
      <p>{children ?? "If the problem persists reach us out in "}</p>
      <Link className="text-[#7289da]" href={metadata.discord}>
        <div className="inline-flex items-center gap-x-1">
          <DiscordLogoIcon className="mt-0.5" />{" "}
          <p className="font-bold">Discord</p>
        </div>
      </Link>
    </div>
  );
}
