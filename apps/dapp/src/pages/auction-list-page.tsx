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
  Chip,
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
import {
  AuctionListSettingsActions,
  auctionListSettingsAtom,
} from "state/user-settings/auction-list-settings";
import { useAtom } from "jotai";
import React from "react";
import { useAccount } from "wagmi";
import { environment } from "@repo/env";

const options = [
  { value: "created", label: "Created" },
  { value: "live", label: "Live" },
  { value: "concluded", label: "Concluded" },
  { value: "decrypted", label: "Decrypted" },
  { value: "settled", label: "Settled" },
];

export default function AuctionListPage() {
  const [userSettings, dispatch] = useAtom(auctionListSettingsAtom);
  const [onlyUserAuctions, setOnlyUserAuctions] = useState(
    userSettings.onlyUserAuctions,
  );
  const [gridView, setGridView] = useState(userSettings.gridView);
  const [sortByStatus, setSortByStatus] = useState<string | undefined>(
    userSettings.activeSort,
  );
  const [filters] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>("");

  const { address } = useAccount();
  const { data: auctions, isLoading, refetch, isRefetching } = useAuctions();

  const secureAuctions = auctions
    .filter((a) => a.isSecure)
    .filter(
      // Filter only user created or participated auctions
      (a) =>
        !address ||
        !onlyUserAuctions ||
        a.seller === address.toLowerCase() ||
        a.bids.some((b) => b.bidder.toLowerCase() === address.toLowerCase()),
    );

  const filteredAuctions =
    filters.length || searchText.length
      ? secureAuctions.filter(
          (a) =>
            filters.includes(a.status) ||
            (searchText.length && searchObject(a, searchText)),
        )
      : //.filter((a) => searchObject(a, searchText))
        secureAuctions;

  const sortedAuctions = [...filteredAuctions].sort((a, b) => {
    if (a.status === sortByStatus && b.status === sortByStatus) {
      //If they're both the same, order by starting date
      return Number(a.start) - Number(b.start);
    }
    if (a.status === sortByStatus) return -1;
    if (b.status === sortByStatus) return 1;

    return sortAuction(a, b);
  });

  const { rows, ...pagination } = usePagination(sortedAuctions, 9);

  const handleSorting = (value: string) => {
    setSortByStatus(value);
    dispatch({
      type: AuctionListSettingsActions.UPDATE_SORT,
      value: sortByStatus,
    });
  };

  const handleSetUserAuctions = () => {
    setOnlyUserAuctions((prev) => {
      const value = !prev;
      dispatch({
        type: AuctionListSettingsActions.ONLY_USER_AUCTIONS,
        value,
      });
      return value;
    });
  };

  const handleViewChange = (value?: string) => {
    const gridView = value === "grid";

    setGridView(gridView);
    dispatch({
      type: AuctionListSettingsActions.UPDATE_VIEW,
      value: gridView,
    });
  };

  //Load settings
  React.useEffect(() => {
    pagination.handleChangePage(userSettings.lastPage ?? 0);
  }, []);

  //Save current page
  React.useEffect(() => {
    dispatch({
      type: AuctionListSettingsActions.UPDATE_PAGE,
      value: pagination.selectedPage,
    });
  }, [pagination.selectedPage]);

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
            Experience the New Era of Token Launches
          </Text>
          <div className="mx-auto mt-6 flex w-min gap-x-2">
            <ScrollLink to="auctions" offset={-10} smooth={true}>
              <Button
                onClick={() => handleSorting("created")}
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
              <Text size="lg">{isLoading ? "Loading " : ""}Token Launches</Text>
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
                defaultValue={sortByStatus}
                onChange={(value) => handleSorting(value)}
              />

              <Tooltip
                triggerClassName="cursor-pointer"
                content="Only show auctions you've created or participated in."
              >
                <Chip
                  variant={onlyUserAuctions ? "active" : "default"}
                  onClick={() => handleSetUserAuctions()}
                >
                  My Launches
                </Chip>
              </Tooltip>

              <ToggleGroup
                type="single"
                defaultValue={gridView ? "grid" : "list"}
                onValueChange={(value) => handleViewChange(value)}
              >
                <ToggleGroupItem variant="icon" value="list">
                  <RowsIcon />
                </ToggleGroupItem>
                <ToggleGroupItem variant="icon" value="grid">
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
              isLoading && "mask",
            )}
          >
            {isLoading
              ? Array(3)
                  .fill(0)
                  .map((_e, i) => (
                    <AuctionCard
                      isGrid={gridView}
                      loading={isLoading}
                      key={i}
                    />
                  ))
              : rows.map((auction) => (
                  <AuctionCard
                    isGrid={gridView}
                    auction={auction}
                    className="mx-auto"
                    key={auction.chainId + auction.id + "_" + gridView}
                  />
                ))}
          </div>
          <Pagination className="mt-6" {...pagination} />

          {!environment.isProduction && (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="pb-2 font-sans">Want to create an auction?</p>
              <Link to="/create/auction">
                <Button variant="ghost">
                  Create Auction <ArrowRightIcon className="w-6 pl-1" />
                </Button>
              </Link>
            </div>
          )}
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
