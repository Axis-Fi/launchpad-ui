import { Avatar, Badge, Button, Card, Link, Text, Tooltip } from "@repo/ui";
import { SocialRow } from "components/social-row";
import { PageContainer } from "modules/app/page-container";
import { allowedCurators } from "@repo/env";
import { Curator } from "@repo/types";
import { contact } from "@repo/env/src/metadata";
import { ArrowRightIcon } from "lucide-react";

export default function CuratorListPage() {
  const [newestCurator, ...curators] = allowedCurators;

  return (
    <PageContainer
      id="__AXIS_ORIGIN_CURATORS_PAGE__"
      containerClassName="mt-12 lg:mx-0 items-center"
    >
      <>
        <CuratorCard
          key={newestCurator.address}
          curator={newestCurator}
          className="gradient-border gradient-border-shift"
        />
        {curators.map((c) => (
          <CuratorCard key={c.address} curator={c} />
        ))}
      </>

      <div className="flex flex-col items-center justify-center py-8">
        <Button variant="ghost" asChild>
          <Link href={contact} target="_blank">
            Become a curator <ArrowRightIcon className="w-6 pl-1" />
          </Link>
        </Button>
      </div>
    </PageContainer>
  );
}

export function CuratorCard({
  curator,
  hideButton,
  className,
}: {
  curator: Curator;
  hideButton?: boolean;
  className?: string;
}) {
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
          <div className="flex justify-end">
            <Badge className="w-min justify-end" size="m">
              {curator.type === "curator" && "Curator"}
              {curator.type === "platform" && "Platform"}
            </Badge>
          </div>
          {!(hideButton ?? false) && (
            <div className="m-1 flex flex-row justify-end gap-2 lg:mt-0">
              <Tooltip content="Coming Soon">
                <Button variant="secondary" size="md" disabled>
                  View Profile
                </Button>
              </Tooltip>
              <Tooltip content="Coming Soon">
                <Button variant="primary" size="md" disabled>
                  View Launches
                </Button>
              </Tooltip>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
