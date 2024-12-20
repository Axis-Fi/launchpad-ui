import { Curator } from "@axis-finance/types";
import { cn, Text } from "@repo/ui";
import { ImageBanner } from "components/image-banner";

export function CuratorBanner({
  curator,
}: {
  curator?: Pick<Curator, "name" | "banner" | "options">;
}) {
  return (
    <div
      className={cn(
        "relative flex w-full items-end justify-center py-3 lg:h-[480px] lg:py-0",
        !curator && "bg-hero-banner",
      )}
    >
      <ImageBanner imgUrl={curator?.banner} className="absolute">
        <div className="max-w-limit mx-auto flex h-full w-full flex-row flex-wrap ">
          <div className="mb-10 flex w-full flex-col items-center justify-end">
            <div className="relative mb-2 flex justify-center self-center text-center">
              <div className="border-primary absolute inset-0 top-3 -z-10 -ml-10 size-full w-[120%] border bg-neutral-950 blur-2xl" />
              {!curator?.options?.hideName && (
                <Text
                  size="7xl"
                  mono
                  className="dark:text-foreground mx-auto text-neutral-200"
                >
                  {curator?.name}
                </Text>
              )}
            </div>
          </div>
        </div>
      </ImageBanner>
    </div>
  );
}
