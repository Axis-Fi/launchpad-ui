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
  UsdToggle,
} from "@repo/ui";
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
import { environment } from "utils/environment";
import { metadata } from "modules/app/metadata";
import { useMediaQueries } from "loaders/use-media-queries";
import type { Curator } from "@axis-finance/types";

const options = [
  { value: "created", label: "Created" },
  { value: "live", label: "Live" },
  { value: "concluded", label: "Concluded" },
  { value: "decrypted", label: "Decrypted" },
  { value: "settled", label: "Settled" },
];

type AuctionListPageProps = {
  curator?: Curator;
};

const ROW_LIMIT = 9;

export default function AuctionListPage({ curator }: AuctionListPageProps) {
  const { isTabletOrMobile } = useMediaQueries();
  const [userSettings, dispatch] = useAtom(auctionListSettingsAtom);

  const [gridView, setGridView] = useState(
    isTabletOrMobile ?? userSettings.gridView,
  );

  const [sortByStatus, setSortByStatus] = useState<string | undefined>(
    userSettings.activeSort,
  );
  const [filters] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>("");

  const { data: auctions, isLoading } = useAuctions({
    curator: curator?.id,
  });

  const secureAuctions = auctions.filter((a) => "isSecure" in a && a.isSecure);

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

  const { rows, totalRows, ...pagination } = usePagination(
    sortedAuctions,
    ROW_LIMIT,
  );

  const handleSorting = (value: string) => {
    setSortByStatus(value);
    dispatch({
      type: AuctionListSettingsActions.UPDATE_SORT,
      value: sortByStatus,
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
    <div id="__AXIS_HOME_PAGE__">
      <div
        className={cn(
          "relative flex w-full items-end justify-center py-3 lg:h-[480px] lg:py-0",
          !curator && "bg-hero-banner",
        )}
      >
        {curator && (
          <img
            src={curator.banner}
            className="absolute inset-0 mx-auto size-full h-[480px] w-auto bg-center bg-no-repeat"
          />
        )}

        {!curator && (
          <img
            src="dot-grid.svg"
            className="absolute inset-0 size-full object-cover opacity-50"
          />
        )}
        {!isTabletOrMobile && (
          <div className="z-10 mb-10 text-center">
            <Text
              size={isTabletOrMobile ? "2xl" : "7xl"}
              mono
              className="dark:text-neutral-100"
            >
              {curator ? curator.name : "Welcome to Axis"}
            </Text>

            <Text
              size="3xl"
              color="secondary"
              className="mx-auto w-fit lg:text-nowrap dark:text-neutral-200"
            >
              {curator ? "" : "Next-Generation Token Launches"}
            </Text>
            {!curator && (
              <div className="mx-auto mt-6 flex w-min flex-col-reverse  gap-2 lg:flex-row">
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

                <Button
                  className="uppercase dark:border-neutral-200 dark:text-neutral-200"
                  size="lg"
                  variant="secondary"
                >
                  <Link target="_blank" to={metadata.contact}>
                    Apply for Launch
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
        {!curator && isTabletOrMobile && (
          <Text size="7xl" mono>
            Axis
          </Text>
        )}
      </div>

      <ScrollTargetElement name="auctions">
        <PageContainer>
          <div className="flex items-center justify-between">
            {!isTabletOrMobile && (
              <Tooltip content={"Axis is a modular auction protocol"}>
                <Text size="lg">Token Launches</Text>
              </Tooltip>
            )}
            <div className="ml-6 flex flex-grow items-center justify-start">
              <UsdToggle currencySymbol="Quote" />
            </div>

            <div className="flex gap-x-2 px-2 lg:px-0">
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

              {!isTabletOrMobile && (
                <>
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
                </>
              )}
            </div>
          </div>
          {!isLoading && !filteredAuctions.length && (
            <div className="flex h-[400px] w-full items-center justify-center">
              <h3>There aren&apos;t any auctions in this state</h3>
            </div>
          )}
          <div
            className={cn(
              "lg:mt-4",
              gridView
                ? "grid grid-cols-1 gap-4 px-2 md:grid-cols-2 lg:mx-auto lg:grid-cols-3 lg:px-0"
                : "space-y-4",
              isLoading && rows.length === 0 && "mask",
            )}
          >
            {isLoading && rows.length === 0
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
          {totalRows > ROW_LIMIT && (
            <Pagination className="mt-6" {...pagination} />
          )}

          {!environment.isProduction && (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="pb-2 font-sans">Want to launch a token?</p>
              <Button variant="ghost" asChild>
                <Link to="/create/auction">
                  Launch token <ArrowRightIcon className="w-6 pl-1" />
                </Link>
              </Button>
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
