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
  homepage?: string;
  className?: string;
};

export function SocialRow(props: SocialURLs) {
  return (
    <div className={cn("flex h-9 items-center gap-x-4 pl-2", props.className)}>
      <Link href={props.discord}>
        <TwitterLogoIcon className="hover:text-[#1DA1F2]" />
      </Link>

      <Link href={props.discord}>
        <DiscordLogoIcon className="hover:text-[#7289da]" />
      </Link>
      <Link href={props.discord}>
        <GlobeIcon className="hover:text-primary transition-all" />
      </Link>
    </div>
  );
}
