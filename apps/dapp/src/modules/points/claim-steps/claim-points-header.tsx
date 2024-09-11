import { Text, cn } from "@repo/ui";

export function ClaimPointsHeader({
  title = "Axis Drop",
  subtitle = "Points Claiming",
  subtitleClassName,
}: {
  title?: string;
  subtitle?: string;
  subtitleClassName?: string;
}) {
  return (
    <div className="text-right">
      <Text
        size="sm"
        mono
        uppercase
        className="text-foreground-tertiary tracking-widest"
      >
        {title}
      </Text>
      <Text
        className={cn(
          "ml-auto mt-1 w-2/3 font-light leading-none tracking-wide",
          subtitleClassName,
        )}
        size="xl"
        mono
      >
        {subtitle}
      </Text>
    </div>
  );
}
