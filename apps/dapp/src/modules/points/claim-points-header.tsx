import { Text, cn } from "@repo/ui";

export function PointsHeader({
  title = "Axis Points",
  subtitle,
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
          "ml-auto mt-1 w-1/2 font-light leading-none tracking-wide",
          subtitleClassName,
        )}
        size="1xl"
        mono
      >
        {subtitle}
      </Text>
    </div>
  );
}
