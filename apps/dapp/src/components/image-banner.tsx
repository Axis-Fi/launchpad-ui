import { cn } from "@repo/ui";
import React, { useEffect } from "react";

type ImageBannerProps = React.PropsWithChildren<{
  imgUrl?: string;
  isLoading?: boolean;
  onTextColorChange?: (color: string) => void;
}>;

/** Renders an image blurred as a banner with a gradient */
export function ImageBanner({
  imgUrl,
  children,
  isLoading,
  ...props
}: ImageBannerProps) {
  const ref = React.useRef<HTMLImageElement>(null);

  //Determines if the image has a dark or light overall
  //color and whether to apply a light or dark color
  useEffect(() => {
    if (ref.current && props.onTextColorChange) {
      ref.current.onload = () => {
        const color = getImageAverageColor(ref.current!);
        const contrastColor = getContrastingTextColor(
          color.r,
          color.g,
          color.b,
        );
        props.onTextColorChange?.(contrastColor);
      };
    }
  }, []);

  return (
    <div
      className={cn(
        "flex h-[480px] w-full items-end justify-center",
        (isLoading || !imgUrl) && "loading-gradient items-center",
        !isLoading && "bg-cover bg-center bg-no-repeat",
      )}
      style={imgUrl ? { backgroundImage: `url(${imgUrl})` } : {}}
    >
      <img ref={ref} src={imgUrl} className="hidden w-full" />
      {children}
    </div>
  );
}

// Function to calculate average color of an image
function getImageAverageColor(img: HTMLImageElement) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const width = img.naturalWidth;
  const height = img.naturalHeight;

  //Must be set to avoid CORS errors
  img.crossOrigin = "Anonymous";

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0, width, height);

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  let r = 0,
    g = 0,
    b = 0;

  const l = data.length;
  //Extract image data as RGB values
  for (let i = 0; i < l; i += 4) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }

  r = Math.floor(r / (l / 4));
  g = Math.floor(g / (l / 4));
  b = Math.floor(b / (l / 4));

  return { r, g, b };
}

// Function to determine if text should be light or dark
function getContrastingTextColor(r: number, g: number, b: number) {
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "dark" : "light";
}
