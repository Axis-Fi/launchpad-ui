import { Button, DropdownChecker, IconnedInput, cn } from "@repo/ui";
import { ReloadButton } from "components/reload-button";
import { useAuctions } from "modules/auction/hooks/use-auctions";
import { ArrowRightIcon, SearchIcon } from "lucide-react";
import { PageContainer } from "modules/app/page-container";
import { AuctionCard, AuctionCardLoading } from "modules/auction/auction-card";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const options = [
  { value: "created", label: "Created" },
  { value: "live", label: "Live" },
  { value: "concluded", label: "Concluded" },
  { value: "decrypted", label: "Decrypted" },
  { value: "settle", label: "Settled" },
];

export default function AuctionListPage() {
  const [filters, setFilters] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const navigate = useNavigate();
  const { result: auctions, isLoading, refetch, isRefetching } = useAuctions();

  const filteredAuctions = filters.length
    ? auctions
        .filter((a) => filters.includes(a.status))
        .filter((a) => !searchText.length || searchObject(a, searchText))
    : auctions;

  return (
    <PageContainer title="Origin">
      <div className="flex items-center justify-between">
        <h3>Sealed-Bid Auctions</h3>
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
      <div className={cn("mt-4 grid grid-cols-3 gap-4", isLoading && "mask")}>
        {isLoading
          ? [...new Array(6)].map((_e, i) => <AuctionCardLoading key={i} />)
          : filteredAuctions.map((auction) => (
              <AuctionCard
                key={auction.chainId + auction.id}
                auction={auction}
                // TODO support open in new tab
                onClickView={() =>
                  navigate(`/auction/${auction.chainId}/${auction.id}`)
                }
              />
            ))}
      </div>

      <div className="flex flex-col items-center justify-center py-8">
        <p className="font-aeonpro pb-2">Want to create an auction?</p>
        <Button onClick={() => navigate("/create/auction")} variant="outline">
          Create Sealed Bid Auction <ArrowRightIcon className="w-6 pl-1" />
        </Button>
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
