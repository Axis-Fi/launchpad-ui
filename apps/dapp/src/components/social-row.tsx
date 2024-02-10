import { DiscordLogoIcon, TwitterLogoIcon, GlobeIcon } from "@repo/ui";

export type SocialURLs = {
  discord?: string;
  twitter?: string;
  homepage?: string;
};

const SocialLink = (props: React.ComponentPropsWithoutRef<"a">) => (
  <a {...props} target="_blank" rel={props.rel ?? "noreferrer"} />
);

export function SocialRow(props: SocialURLs) {
  return (
    <div className="flex items-center gap-x-4">
      {props.twitter && (
        <SocialLink href={props.discord}>
          <TwitterLogoIcon className="hover:text-[#1DA1F2] " />
        </SocialLink>
      )}

      {props.discord && (
        <SocialLink href={props.discord}>
          <DiscordLogoIcon className="hover:text-[#7289da]" />
        </SocialLink>
      )}
      {props.homepage && (
        <SocialLink href={props.discord}>
          <GlobeIcon className="hover:text-primary" />
        </SocialLink>
      )}
    </div>
  );
}
