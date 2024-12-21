import {
  Text,
  Pagination,
  Tooltip,
  cn,
  usePagination,
  UsdToggle,
} from "@repo/ui";
import { useAuctions } from "modules/auction/hooks/use-auctions";
import { PageContainer } from "modules/app/page-container";
import { AuctionCard } from "modules/auction/auction-card";
import { useState } from "react";
import { Element as ScrollTargetElement } from "react-scroll";
import {
  AuctionListSettingsActions,
  auctionListSettingsAtom,
} from "state/user-settings/auction-list-settings";
import { useAtom } from "jotai";
import React from "react";
import { useMediaQueries } from "loaders/use-media-queries";
import { type Curator } from "@axis-finance/types";
import { CuratorBanner } from "modules/curator/curator-banner";

type AuctionListPageProps = {
  curator?: Curator;
};

export default function CuratorLaunchPage({ curator }: AuctionListPageProps) {
  const { isTabletOrMobile } = useMediaQueries();
  const [userSettings, dispatch] = useAtom(auctionListSettingsAtom);

  const [gridView] = useState(userSettings.gridView ?? true);

  const { data: auctions, isLoading } = useAuctions({
    curator: curator?.id,
  });

  const secureAuctions = auctions.filter((a) => "isSecure" in a && a.isSecure);

  const { rows, ...pagination } = usePagination(secureAuctions, 9);

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
      <CuratorBanner curator={curator} />

      <ScrollTargetElement name="auctions">
        <PageContainer className="mb-20">
          <div className="flex items-center justify-between">
            {!isTabletOrMobile && (
              <Tooltip content={"Axis is a modular auction protocol"}>
                <Text size="lg">Curated Launches</Text>
              </Tooltip>
            )}
            <div className="ml-6">
              <UsdToggle currencySymbol="Quote" />
            </div>
          </div>
          {!isLoading && !secureAuctions.length && (
            <div className="flex h-[400px] w-full items-center justify-center">
              <h3>No launches curated yet</h3>
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
          {rows.length > 9 && <Pagination className="mt-6" {...pagination} />}
        </PageContainer>
      </ScrollTargetElement>
    </div>
  );
}
