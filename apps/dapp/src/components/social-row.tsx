import {
  cn,
  Link,
  DiscordLogoIcon,
  TwitterLogoIcon,
  GlobeIcon,
} from "@repo/ui";

export type SocialURLs = {
  discord?: string;
  twitter?: string;
  website?: string;
  className?: string;
};

export function SocialRow(props: SocialURLs) {
  return (
    <div className={cn("flex h-9 items-center gap-x-4 pl-2", props.className)}>
      {props.twitter && (
        <Link href={props.twitter}>
          <TwitterLogoIcon className="hover:text-[#1DA1F2]" />
        </Link>
      )}

      {props.discord && (
        <Link href={props.discord}>
          <DiscordLogoIcon className="hover:text-[#7289da]" />
        </Link>
      )}
      {props.website && (
        <Link href={props.website}>
          <GlobeIcon className="hover:text-primary transition-all" />
        </Link>
      )}
    </div>
  );
}
