import { cn } from "..";
import { TooltipRoot, TooltipContent, TooltipTrigger } from "./primitives";

export function Tooltip(
  props: React.PropsWithChildren<{
    content: React.ReactNode;
    triggerClassName?: string;
    asChild?: boolean;
  }>,
) {
  if (!props.content) return <>{props.children}</>;
  return (
    <TooltipRoot>
      <TooltipTrigger
        className={cn("cursor-help", props.triggerClassName)}
        asChild={!!props.asChild}
      >
        {props.children}
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p>{props.content}</p>
      </TooltipContent>
    </TooltipRoot>
  );
}
