import {
  TooltipRoot,
  TooltipContent,
  TooltipTrigger,
} from "./primitives/tooltip";

type TooltipProps = React.PropsWithChildren<{
  content: React.ReactNode;
  className?: string;
}>;

export function Tooltip({ content, children, ...props }: TooltipProps) {
  if (!content) return <>{children}</>;
  return (
    <TooltipRoot>
      <TooltipTrigger
        className={props.className}
        onClick={(e) => e.preventDefault()}
      >
        {children}
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p>{content}</p>
      </TooltipContent>
    </TooltipRoot>
  );
}
