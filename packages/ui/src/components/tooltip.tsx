import { cn } from "..";
import { TooltipRoot, TooltipContent, TooltipTrigger } from "./primitives";

export function Tooltip(
  props: React.PropsWithChildren<{
    content: React.ReactNode;
    triggerClassName?: string;
  }>,
) {
  if (!props.content) return <>{props.children}</>;
  return (
    <TooltipRoot>
      <TooltipTrigger className={cn("cursor-help", props.triggerClassName)}>
        {props.children}
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p>{props.content}</p>
      </TooltipContent>
    </TooltipRoot>
  );
}
