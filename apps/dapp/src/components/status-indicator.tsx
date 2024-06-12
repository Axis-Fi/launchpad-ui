import { cn } from "@repo/ui";
import { LoadingIndicator } from "modules/app/loading-indicator";

/** Displays an icon with a color representing the status and a loading spinner in case of loading */
export function StatusIcon({
  isLoading,
  isSuccess,
  isError,
  Icon,
}: {
  isLoading?: boolean;
  isSuccess?: boolean;
  isIdle?: boolean;
  isError?: boolean;
  Icon: React.FC<React.HTMLAttributes<HTMLOrSVGElement>>;
}) {
  return (
    <div className="flex flex-col items-center justify-center">
      <Icon
        className={cn(
          "transition-all",
          isSuccess && "text-axis-green",
          isError && "text-destructive",
        )}
      />
      {isLoading && (
        <LoadingIndicator
          rootClassName="absolute mt-14"
          className="fill-black"
        />
      )}
    </div>
  );
}

/** Displays a dashed line */
export function StatusSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mx-1 h-0 grow border-t border-dashed transition-all",
        className,
      )}
      {...props}
    />
  );
}
