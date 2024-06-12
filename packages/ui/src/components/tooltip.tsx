import { TooltipRoot, TooltipContent, TooltipTrigger } from "./primitives";

export function Tooltip(
  props: React.PropsWithChildren<{
    content: React.ReactNode;
  }>,
) {
  if (!props.content) return <>{props.children}</>;
  return (
    <TooltipRoot>
      <TooltipTrigger className="cursor-help">{props.children}</TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p>{props.content}</p>
      </TooltipContent>
    </TooltipRoot>
  );
}
