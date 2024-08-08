import { Avatar, Button, Card, Text, Tooltip } from "@repo/ui";
import { SocialRow } from "components/social-row";
import { PageContainer } from "modules/app/page-container";
import { allowedCurators } from "@repo/env";
import { Curator } from "@repo/types";

export default function CuratorListPage() {
  return (
    <PageContainer
      title="Token Launch Curators"
      containerClassName="items-center"
    >
      <div className="mx-2 my-auto max-w-[1200px] space-y-6 lg:mx-0">
        {allowedCurators.map((c) => (
          <CuratorCard key={c.address} curator={c} />
        ))}
      </div>
    </PageContainer>
  );
}

export function CuratorCard({
  curator,
  hideButton,
}: {
  curator: Curator;
  hideButton?: boolean;
}) {
  return (
    <Card>
      <div className="flex flex-col justify-between lg:flex-row">
        <div className="flex">
          <Avatar
            className="border-primary size-[100px] border-4 p-2 lg:size-[120px]"
            src={curator.avatar}
          />
          <div className="ml-6 flex flex-col items-start justify-between">
            <div className="flex items-center">
              <Text mono size="xl">
                {curator.name}
              </Text>
              <SocialRow
                className="ml-4"
                iconClassName="size-6"
                twitter={`https://x.com/${curator.twitter}`}
                website={curator.website}
              />
            </div>
            <Text className="mt-2">{curator.description}</Text>
          </div>
        </div>

        {!hideButton && (
          <div className="mt-2 flex flex-row justify-end gap-2 lg:mt-0 lg:flex-col ">
            <Tooltip content="Coming Soon">
              <Button disabled>View Launches</Button>
            </Tooltip>
          </div>
        )}
      </div>
    </Card>
  );
}
