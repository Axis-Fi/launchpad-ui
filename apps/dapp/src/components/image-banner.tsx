export function ImageBanner({
  imgUrl,
  children,
}: { imgUrl?: string } & React.PropsWithChildren) {
  return (
    <div className="relative z-10 size-full overflow-hidden rounded-sm">
      <div
        className="absolute inset-0 size-full "
        style={{
          position: "absolute",
          height: "100%",
          zIndex: -1,
          backgroundImage: `url(${imgUrl})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(8px)",
        }}
      />
      <div className="z-20">{children}</div>
      <div
        className="absolute inset-0 size-full rounded-sm"
        style={{
          zIndex: -1,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",

          backgroundImage: `linear-gradient(
          hsla(11, 0%, 0%, 0.54), 
          hsla(40, 100%, 100%, 0.18))`,
        }}
      />
    </div>
  );
}
