import { Button, Link } from "@repo/ui";
import { SocialRow } from "../../components/social-row";
import { discord, twitter, contact, website } from "config/metadata";
import { AppVersion } from "./app-version";

export function AppFooter() {
  return (
    <div className="py-6">
      <div className="bg-secondary flex items-center justify-between rounded-full">
        <AppVersion className="ml-4" />

        <div className="flex items-center gap-x-3 px-4">
          <SocialRow discord={discord} twitter={twitter} website={website} />
          <Link href="https://docs.axis.finance/">
            <Button
              size="sm"
              className="px-0 pl-2 uppercase tracking-wide"
              variant="link"
            >
              Docs
            </Button>
          </Link>
          <Link href={"mailto:" + contact}>
            <Button size="sm" className="px-0 uppercase" variant="link">
              Contact
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
