import {
  Text,
  Button,
  IconnedInput,
  Pagination,
  ToggleGroup,
  ToggleGroupItem,
  Tooltip,
  cn,
  usePagination,
  Select,
} from "@repo/ui";
import { ReloadButton } from "components/reload-button";
import { useAuctions } from "modules/auction/hooks/use-auctions";
import { ArrowDownIcon, ArrowRightIcon, SearchIcon } from "lucide-react";
import { PageContainer } from "modules/app/page-container";
import { AuctionCard } from "modules/auction/auction-card";
import { useState } from "react";
import { Link } from "react-router-dom";
import { DashboardIcon, RowsIcon } from "@radix-ui/react-icons";
import {
  Link as ScrollLink,
  Element as ScrollTargetElement,
} from "react-scroll";
import { sortAuction } from "modules/auction/utils/sort-auctions";

const options = [
  { value: "created", label: "Created" },
  { value: "live", label: "Live" },
  { value: "concluded", label: "Concluded" },
  { value: "decrypted", label: "Decrypted" },
  { value: "settled", label: "Settled" },
];

export default function AuctionListPage() {
  const [filters] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [gridView, setGridView] = useState(false);
  const [sortByStatus, setSortByStatus] = useState<string | undefined>();
  const { data: auctions, isLoading, refetch, isRefetching } = useAuctions();

  const filteredAuctions = filters.length
    ? auctions
        .filter((a) => filters.includes(a.status))
        .filter((a) => !searchText.length || searchObject(a, searchText))
    : auctions;

  const sortedAuctions = filteredAuctions.sort((a, b) => {
    if (a.status === sortByStatus && b.status === sortByStatus) {
      //If they're both the same, order by starting date
      return Number(a.start) - Number(b.start);
    }
    if (a.status === sortByStatus) return -1;
    if (b.status === sortByStatus) return 1;

    return sortAuction(a, b);
  });

  const { rows, ...pagination } = usePagination(sortedAuctions, 9);

  return (
    <div className="">
      <div className="bg-hero-banner flex h-[582px] w-full items-end justify-center">
        <div className="mb-10">
          <Text size="7xl" mono>
            Welcome to Origin
          </Text>

          <Text
            size="3xl"
            color="secondary"
            className="mx-auto w-fit text-nowrap"
          >
            send copy plis mi familia
          </Text>
          <div className="mx-auto mt-6 flex w-min gap-x-2">
            <ScrollLink to="auctions" offset={-10} smooth={true}>
              <Button
                onClick={() => {
                  setSortByStatus("created");
                }}
                className="uppercase"
                size="lg"
              >
                <div className="flex items-center">
                  Upcoming Sales
                  <div className="size-6">
                    <ArrowDownIcon />
                  </div>
                </div>
              </Button>
            </ScrollLink>

            <Button className="uppercase" size="lg" variant="secondary">
              Apply for Launch
            </Button>
          </div>
        </div>
      </div>

      <ScrollTargetElement name="auctions">
        <PageContainer>
          <div className="flex items-center justify-between">
            <Tooltip content={"Origin is a modular Auction suite"}>
              <Text size="2xl">Token Launches</Text>
            </Tooltip>
            <div className="flex gap-x-2">
              <IconnedInput
                icon={<SearchIcon />}
                className="placeholder:text-foreground"
                placeholder="Search"
                onChange={(e) => setSearchText(e.target.value)}
              />
              <Select
                triggerClassName="w-[120px]"
                placeholder="Sort By"
                options={options}
                onChange={(value) => {
                  console.log({ value });
                  setSortByStatus(value);
                }}
              />

              <ToggleGroup
                type="single"
                defaultValue="list"
                onValueChange={(value) => setGridView(value === "grid")}
              >
                <ToggleGroupItem value="list">
                  <RowsIcon />
                </ToggleGroupItem>
                <ToggleGroupItem value="grid">
                  <DashboardIcon />
                </ToggleGroupItem>
              </ToggleGroup>

              <ReloadButton
                tooltip="Reload Auctions"
                refetching={isRefetching}
                onClick={() => refetch()}
              />
            </div>
          </div>
          {!isLoading && !filteredAuctions.length && (
            <div className="flex h-[400px] w-full items-center justify-center">
              <h3>There aren&apos;t any auctions in this state</h3>
            </div>
          )}
          <div
            className={cn(
              "mt-4 ",
              gridView ? "mx-auto grid grid-cols-3 gap-4" : "space-y-4",
            )}
          >
            {rows.map((auction) => (
              <AuctionCard
                isGrid={gridView}
                className="mx-auto"
                loading={isLoading}
                key={auction.chainId + auction.id + "_" + gridView}
                auction={auction}
              />
            ))}
          </div>
          <Pagination className="mt-6" {...pagination} />

          <div className="flex flex-col items-center justify-center py-8">
            <p className="pb-2 font-sans">Want to create an auction?</p>
            <Link to="/create/auction">
              <Button variant="ghost">
                Create Sealed Bid Auction{" "}
                <ArrowRightIcon className="w-6 pl-1" />
              </Button>
            </Link>
          </div>
        </PageContainer>
      </ScrollTargetElement>
    </div>
  );
}

function searchObject<T extends object>(obj: T, text: string): boolean {
  return Object.values(obj).some((value: unknown) => {
    return !!value && typeof value === "object"
      ? searchObject(value, text)
      : String(value).toLocaleLowerCase().includes(text.toLocaleLowerCase());
  });
}
