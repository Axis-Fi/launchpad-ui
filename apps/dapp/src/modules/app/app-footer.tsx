import { Button, Link } from "@repo/ui";
import { SocialRow } from "../../components/social-row";
import { metadata } from "@repo/env";
import { AppVersion } from "./app-version";

const { discord, twitter, website, contact } = metadata;

export function AppFooter() {
  return (
    <div className="max-w-limit mx-auto hidden w-full py-6 lg:block">
      <div className="bg-hero-banner flex h-12 items-center justify-between rounded-full">
        <AppVersion className="ml-4" />

        <div className="text-surface flex items-center gap-x-3 px-4">
          <SocialRow
            discord={discord}
            twitter={twitter}
            website={website}
            iconClassName={"size-8"}
          />
          <Link href="https://docs.axis.finance/">
            <Button
              size="sm"
              className="text-surface px-0 pl-2 uppercase tracking-wide"
              variant="link"
            >
              Docs
            </Button>
          </Link>
          <Link href={"mailto:" + contact}>
            <Button
              size="sm"
              className="text-surface px-0 uppercase"
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
