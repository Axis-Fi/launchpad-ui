/** Renders an image blurred as a banner with a gradient */
export function ImageBanner({
  imgUrl,
  children,
}: { imgUrl?: string } & React.PropsWithChildren) {
  const isLoading = imgUrl === undefined;
  const classes = isLoading
    ? "loading-gradient"
    : "bg-center bg-cover bg-no-repeat";
  return (
    <div
      className={`${classes} flex h-[480px] w-full items-end justify-center`}
      style={imgUrl ? { backgroundImage: `url(${imgUrl})` } : {}}
    >
      {children}
    </div>
  );
}
