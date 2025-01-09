import { Link } from "react-router-dom";
import type { Address } from "viem";
import { Avatar, Button, Card, Text } from "@repo/ui";
import { SocialRow } from "components/social-row";
import { PageContainer } from "modules/app/page-container";
import { allowedCurators } from "modules/app/curators";
import { Curator } from "@axis-finance/types";
import { ArrowRightIcon } from "lucide-react";
import { useCurators } from "modules/curator/hooks/use-curators";
import { CuratorProfile } from "@repo/ipfs-api/src/types";
import { useMediaQueries } from "loaders/use-media-queries";

// TODO: remove concept of "static curators" and just use the curator profiles once they're migrated
const curatorProfileToCurator = (profile: CuratorProfile): Curator => ({
  id: profile.id,
  type: "curator",
  name: profile.name,
  description: profile.description,
  address: profile.address as Address,
  twitter: profile.twitter,
  website: profile.links.website,
  avatar: profile.links.avatar,
  banner: profile.links.banner,
});

export default function CuratorListPage() {
  const [newestStaticCurator, ...staticCurators] = allowedCurators;
  const curatorsQuery = useCurators()!;
  const curators = curatorsQuery.data ?? [];

  return (
    <PageContainer
      id="__AXIS_CURATORS_LIST__"
      containerClassName="mt-12 lg:mx-0 items-center"
    >
      <>
        {curators.map((c: CuratorProfile) => (
          <CuratorCard key={c.id} curator={curatorProfileToCurator(c)} />
        ))}
        <CuratorCard
          curator={newestStaticCurator}
          // className="gradient-border gradient-border-shift"
        />
        {staticCurators.map((c: Curator) => (
          <CuratorCard key={c.name} curator={c} />
        ))}
      </>

      <div className="flex flex-col items-center justify-center py-8">
        <Button variant="ghost" asChild>
          <Link to="/curator-authenticate">
            Become a curator <ArrowRightIcon className="w-6 pl-1" />
          </Link>
        </Button>
      </div>
    </PageContainer>
  );
}

export function CuratorCard({
  curator,
  className,
}: {
  curator: Curator;
  className?: string;
}) {
  const { isTabletOrMobile } = useMediaQueries();

  return (
    <Card className={className}>
      <div className="flex justify-between space-x-6">
        <Avatar
          className="border-primary m-auto size-[100px] lg:size-[120px]"
          src={curator.avatar}
        />
        <div className="flex w-full flex-col items-start justify-between">
          <div className="flex flex-row">
            <Text mono size="xl" className="mt-2 text-nowrap">
              {curator.name}
            </Text>
            <SocialRow
              className="m-auto ml-2"
              iconClassName="size-6"
              twitter={`https://x.com/${curator.twitter}`}
              website={curator.website}
            />
          </div>

          <Text className="mt-2 max-w-[60ch]">{curator.description}</Text>
        </div>

        <div className="flex flex-col justify-between">
          <div className="flex justify-end"></div>
          <div className="m-1 flex flex-row justify-end gap-2 lg:mt-0">
            <Button variant="primary" size={isTabletOrMobile ? "sm" : "md"}>
              <Link to={`/curator/${curator.id}`}>View Launches</Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
