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
    ? props.children.map((c, idx) => cloneWithAuction(c, props.auction, idx))
    : cloneWithAuction(
        props.children as AuctionLabelChildren,
        props.auction,
        0,
      );

  return (
    <AuctionInfoCard className={props.className}>{children}</AuctionInfoCard>
  );
}

function cloneWithAuction(
  children: AuctionLabelChildren,
  auction: Auction,
  key: number,
) {
  return React.isValidElement(children)
    ? React.cloneElement(children, { auction, key })
    : children;
}
