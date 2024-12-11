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
import { ImageBanner } from "components/image-banner";

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
      <div
        className={cn(
          "relative flex w-full items-end justify-center py-3 lg:h-[480px] lg:py-0",
          !curator && "bg-hero-banner",
        )}
      >
        <ImageBanner imgUrl={curator?.banner} className="absolute">
          <div className="max-w-limit mx-auto flex h-full w-full flex-row flex-wrap ">
            <div className="mb-10 flex w-full flex-col items-center justify-end">
              <div className="relative mb-2 flex justify-center self-center text-center">
                <div className="border-primary absolute inset-0 top-3 -z-10 -ml-10 size-full w-[120%] border bg-neutral-950 blur-2xl" />
                {!curator?.options?.hideName && (
                  <Text
                    size="7xl"
                    mono
                    className="dark:text-foreground mx-auto text-neutral-200"
                  >
                    {curator?.name}
                  </Text>
                )}
              </div>
            </div>
          </div>
        </ImageBanner>
      </div>

      <ScrollTargetElement name="auctions">
        <PageContainer className="mb-20">
          <div className="flex items-center justify-between">
            {!isTabletOrMobile && (
              <Tooltip content={"Axis is a modular auction protocol"}>
                <Text size="lg">Token Launches</Text>
              </Tooltip>
            )}
            <div className="ml-6">
              <UsdToggle currencySymbol="Quote" />
            </div>
          </div>
          {!isLoading && !secureAuctions.length && (
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
          {rows.length > 9 && <Pagination className="mt-6" {...pagination} />}
        </PageContainer>
      </ScrollTargetElement>
    </div>
  );
}
