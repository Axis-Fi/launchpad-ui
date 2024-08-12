import { Link } from "@repo/ui";
import { ArrowUpRightIcon } from "lucide-react";
import React from "react";

const ExternalLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a">
>((props, ref) => {
  return (
    <Link className="flex items-center justify-center" {...props} ref={ref}>
      {props.children} <ArrowUpRightIcon className="mt-1 inline size-4" />
    </Link>
  );
});

ExternalLink.displayName = "ExternalLink";

export default ExternalLink;
