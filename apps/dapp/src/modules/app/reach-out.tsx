import metadata from "config/metadata";
import { Link, cn } from "@repo/ui";

/**Shows a message with a link to Discord*/
export function ReachOutMessage({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <div className={cn("flex gap-x-1", className)} {...props}>
      <p>
        {children ?? "If the problem persists reach us out in "}
        <Link className="inline text-[#7289da]" href={metadata.discord}>
          <div className="inline-flex items-center gap-x-1">
            <p className="font-bold">Discord</p>
          </div>
        </Link>
      </p>
    </div>
  );
}
