import { cn } from "@repo/ui";
import React from "react";

type ImageBannerProps = React.HTMLProps<HTMLDivElement> & {
  imgUrl?: string;
  isLoading?: boolean;
};

/** Renders an image blurred as a banner with a gradient */
export function ImageBanner({
  imgUrl,
  children,
  isLoading,
  ...props
}: ImageBannerProps) {
  return (
    <div
      className={cn(
        "relative flex h-[480px] w-full items-end justify-center",
        (isLoading || !imgUrl) && "loading-gradient items-center",
        props.className,
      )}
    >
      <div
        className={cn(
          "absolute h-full w-dvw",
          !isLoading && "bg-center bg-no-repeat",
        )}
        style={
          imgUrl
            ? {
                backgroundSize: "auto 480px",
                backgroundImage: `url(${imgUrl})`,
              }
            : {}
        }
      />
      <div className="z-10 h-full w-full">{children}</div>
    </div>
  );
}
