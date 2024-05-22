import {
  Text,
  Button,
  DropdownChecker,
  IconnedInput,
  Pagination,
  ToggleGroup,
  ToggleGroupItem,
  Tooltip,
  cn,
  usePagination,
} from "@repo/ui";
import { ReloadButton } from "components/reload-button";
import { useAuctions } from "modules/auction/hooks/use-auctions";
import { ArrowRightIcon, SearchIcon } from "lucide-react";
import { PageContainer } from "modules/app/page-container";
import { AuctionCard } from "modules/auction/auction-card";
import { useState } from "react";
import { Link } from "react-router-dom";
import { DashboardIcon, RowsIcon } from "@radix-ui/react-icons";

const options = [
  { value: "created", label: "Created" },
  { value: "live", label: "Live" },
  { value: "concluded", label: "Concluded" },
  { value: "decrypted", label: "Decrypted" },
  { value: "settled", label: "Settled" },
];

export default function AuctionListPage() {
  const [filters, setFilters] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [gridView, setGridView] = useState(false);
  const { data: auctions, isLoading, refetch, isRefetching } = useAuctions();

  const filteredAuctions = filters.length
    ? auctions
        .filter((a) => filters.includes(a.status))
        .filter((a) => !searchText.length || searchObject(a, searchText))
    : auctions;

  const { rows, ...pagination } = usePagination(filteredAuctions, 9);

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <Tooltip content={"Origin is a modular Auction suite"}>
          <Text size="2xl">Token Launches</Text>
        </Tooltip>
        <div className="flex gap-x-2">
          <DropdownChecker
            setFilters={setFilters}
            filters={filters}
            options={options}
            label="Auction Status"
          />
          <IconnedInput
            icon={<SearchIcon />}
            className="placeholder:text-foreground"
            placeholder="Search"
            onChange={(e) => setSearchText(e.target.value)}
          />
          <ToggleGroup
            type="single"
            onValueChange={(value) => setGridView(value === "grid")}
          >
            <ToggleGroupItem value="grid">
              <DashboardIcon />
            </ToggleGroupItem>
            <ToggleGroupItem value="list">
              <RowsIcon />
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
        <p className="font-aeonpro pb-2">Want to create an auction?</p>
        <Link to="/create/auction">
          <Button variant="ghost">
            Create Sealed Bid Auction <ArrowRightIcon className="w-6 pl-1" />
          </Button>
        </Link>
      </div>
    </PageContainer>
  );
}

function searchObject<T extends object>(obj: T, text: string): boolean {
  return Object.values(obj).some((value: unknown) => {
    return !!value && typeof value === "object"
      ? searchObject(value, text)
      : String(value).toLocaleLowerCase().includes(text.toLocaleLowerCase());
  });
}
