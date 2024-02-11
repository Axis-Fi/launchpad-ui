import { Link, DiscordLogoIcon, TwitterLogoIcon, GlobeIcon } from "@repo/ui";

export type SocialURLs = {
  discord?: string;
  twitter?: string;
  homepage?: string;
};

export function SocialRow(props: SocialURLs) {
  return (
    <div className="flex items-center gap-x-4">
      {props.twitter && (
        <Link href={props.discord}>
          <TwitterLogoIcon className="hover:text-[#1DA1F2]" />
        </Link>
      )}

      {props.discord && (
        <Link href={props.discord}>
          <DiscordLogoIcon className="hover:text-[#7289da]" />
        </Link>
      )}
      {props.homepage && (
        <Link href={props.discord}>
          <GlobeIcon className="hover:text-primary transition-all" />
        </Link>
      )}
    </div>
  );
}
