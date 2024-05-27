import { Auction, PropsWithAuction } from "@repo/types";
import React from "react";

export function AuctionInfoCard(
  props: React.HtmlHTMLAttributes<HTMLDivElement>,
) {
  return (
    <div className={props.className}>
      <div className="flex justify-between">{props.children}</div>
    </div>
  );
}

type AuctionLabelChildren = React.ReactElement<PropsWithAuction>;

export function AuctionMetricsContainer(
  props: React.HtmlHTMLAttributes<HTMLDivElement> &
    PropsWithAuction & {
      children?:
        | AuctionLabelChildren
        | AuctionLabelChildren[]
        | React.ReactNode;
    },
) {
  if (!props.children) {
    throw new Error("No children provided");
  }

  const children = Array.isArray(props.children)
    ? props.children.map((c) => cloneWithAuction(c, props.auction))
    : cloneWithAuction(props.children as AuctionLabelChildren, props.auction);

  return (
    <AuctionInfoCard className={props.className}>{children}</AuctionInfoCard>
  );
}

function cloneWithAuction(children: AuctionLabelChildren, auction: Auction) {
  return React.isValidElement(children)
    ? React.cloneElement(children, { auction })
    : children;
}
