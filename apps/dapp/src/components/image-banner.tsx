import { cn } from "@repo/ui";

/** Renders an image blurred as a banner with a gradient */
export function ImageBanner({
  imgUrl,
  children,
}: { imgUrl?: string } & React.PropsWithChildren) {
  const isLoading = imgUrl === undefined;

  return (
    <div
      className={cn(
        "flex h-[480px] w-full items-end justify-center",
        isLoading && "loading-gradient",
        !isLoading && "bg-cover bg-center bg-no-repeat",
      )}
      style={imgUrl ? { backgroundImage: `url(${imgUrl})` } : {}}
    >
      {children}
    </div>
  );
}
