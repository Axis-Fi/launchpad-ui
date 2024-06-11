import { cn } from "@repo/ui";

type ImageBannerProps = React.PropsWithChildren<{
  imgUrl?: string;
  isLoading?: boolean;
}>;

/** Renders an image blurred as a banner with a gradient */
export function ImageBanner({ imgUrl, children, isLoading }: ImageBannerProps) {
  return (
    <div
      className={cn(
        "flex h-[480px] w-full items-end justify-center",
        (isLoading || !imgUrl) && "loading-gradient items-center",
        !isLoading && "bg-cover bg-center bg-no-repeat",
      )}
      style={imgUrl ? { backgroundImage: `url(${imgUrl})` } : {}}
    >
      {children}
    </div>
  );
}
