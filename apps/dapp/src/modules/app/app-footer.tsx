import { Button, Link, Tooltip, cn, useTheme } from "@repo/ui";
import { SocialRow } from "../../components/social-row";
import { metadata } from "@repo/env";
import { AppVersion } from "./app-version";
import { useCuratorPage } from "loaders/use-curator-page";
import { AxisWordmark } from "./axis-wordmark";

const { discord, twitter, website, contact } = metadata;

export function AppFooter() {
  const { isCuratorPage } = useCuratorPage();

  return (
    <div className="max-w-limit mx-auto hidden w-full py-6 lg:block">
      <div
        className={cn(
          "flex h-12 items-center justify-between rounded-full",
          isCuratorPage
            ? "bg-neutral-200 dark:bg-neutral-50"
            : "bg-hero-banner",
        )}
      >
        {isCuratorPage ? <PoweredByAxis /> : <AppVersion className="ml-4" />}

        <div
          className={cn(
            "text-surface flex items-center gap-x-3 px-4",
            isCuratorPage && "text-foreground dark:text-neutral-500",
          )}
        >
          <SocialRow
            discord={discord}
            twitter={twitter}
            website={website}
            iconClassName={"size-8"}
          />
          <Link href={contact} target="_blank">
            <Button
              size="sm"
              className={cn(
                "text-surface px-0 uppercase ",
                isCuratorPage && "text-foreground dark:text-neutral-500",
              )}
              variant="link"
            >
              Contact
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function PoweredByAxis() {
  const { themeColor } = useTheme();
  return (
    <div className="text-foreground ml-4 flex items-center dark:text-neutral-500">
      {" "}
      <Tooltip
        content={
          <>
            App Version: <AppVersion />
          </>
        }
      >
        Powered by{" "}
        <AxisWordmark
          className="-mt-0.5 inline size-10"
          light={themeColor === "dark"}
        />
      </Tooltip>
    </div>
  );
}
