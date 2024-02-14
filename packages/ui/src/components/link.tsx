import React from "react";

const Link = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a">
>((props, ref) => (
  <a className="inline" target="_blank" rel="noopener" {...props} ref={ref} />
));

Link.displayName = "Link";

export { Link };
