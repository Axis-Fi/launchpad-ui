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
          "saturate-75 absolute top-4 hidden h-[115%] w-[280%] blur-xl lg:block",
          !isLoading && "bg-center ",
        )}
        style={
          imgUrl
            ? {
                backgroundSize: "auto",
                backgroundImage: `url(${imgUrl})`,
              }
            : {}
        }
      />
      <div
        className="absolute h-full w-dvw bg-center bg-no-repeat lg:top-8"
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
