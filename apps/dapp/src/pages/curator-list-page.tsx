import {
  Avatar,
  Button,
  Card,
  Metric,
  Text,
  Tooltip,
  trimAddress,
} from "@repo/ui";
import { SocialRow } from "components/social-row";
import { PageContainer } from "modules/app/page-container";
import { Address } from "viem";

type Curator = {
  address: Address;
  name: string;
  twitter: string;
  avatar: string;
  website?: string;
};

const curatorList: Curator[] = [
  {
    name: "aphex",
    address: "0x42000000000000000000000000000000000069",
    twitter: "heyphex",
    avatar: "https://github.com/wenfix.png",
    website: "https://axis.finance",
  },
  {
    name: "tex",
    address: "0x42000000000000000000000000000000000069",
    twitter: "0xtex",
    avatar: "https://github.com/0xtex.png",
    website: "https://axis.finance",
  },
];

export default function CuratorListPage() {
  return (
    <PageContainer title="Token Launch Curators">
      <div className="mx-2 grid grid-cols-1 gap-6 lg:mx-0 lg:grid-cols-2">
        {curatorList.map((c) => (
          <Card key={c.address}>
            <div className="flex flex-col justify-between lg:flex-row">
              <div className="flex">
                <Avatar
                  className="size-[100px] lg:size-[150px]"
                  src={c.avatar}
                />
                <div className="ml-6">
                  <Text mono size="2xl">
                    {c.name}
                  </Text>
                  <Tooltip content={c.address}>
                    <Text>{trimAddress(c.address, 6)}</Text>{" "}
                  </Tooltip>
                  <SocialRow
                    className="mt-2"
                    iconClassName="size-8"
                    twitter={`https://x.com/${c.twitter}`}
                    website={c.website}
                  />
                </div>
              </div>

              <div className="mt-2 flex flex-row justify-end gap-2 lg:mt-0 lg:flex-col ">
                <Metric label="Launches Curated" className="lg:text-right">
                  420
                </Metric>
                <Tooltip content="Coming Soon">
                  <Button disabled>View Launches</Button>
                </Tooltip>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
