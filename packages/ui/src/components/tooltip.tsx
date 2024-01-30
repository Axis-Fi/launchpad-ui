import { TooltipRoot, TooltipContent, TooltipTrigger } from "./primitives";

export function Tooltip(
  props: React.PropsWithChildren<{
    content: React.ReactNode;
  }>,
) {
  return (
    <TooltipRoot>
      <TooltipTrigger>{props.children}</TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p>{props.content}</p>
      </TooltipContent>
    </TooltipRoot>
  );
}
