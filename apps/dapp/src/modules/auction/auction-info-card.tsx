import { Auction, PropsWithAuction } from "@repo/types";
import React from "react";

export function AuctionInfoCard(
  props: React.HtmlHTMLAttributes<HTMLDivElement>,
) {
  return (
    <div className={props.className}>
      <h4 className="text-3xl tracking-wide">Auction Info</h4>
      <div className="mt-4 grid grid-cols-2 gap-x-10 gap-y-6">
        {props.children}
      </div>
    </div>
  );
}

type AuctionLabelChildren = React.ReactElement<PropsWithAuction>;

export function AuctionInfoContainer(
  props: React.HtmlHTMLAttributes<HTMLDivElement> &
    PropsWithAuction & {
      children?: AuctionLabelChildren | AuctionLabelChildren[];
    },
) {
  if (!props.children) {
    throw new Error("No children provided");
  }

  const children = Array.isArray(props.children)
    ? props.children.map((c) => cloneWithAuction(c, props.auction))
    : cloneWithAuction(props.children, props.auction);

  return (
    <AuctionInfoCard className={props.className}>{children}</AuctionInfoCard>
  );
}

function cloneWithAuction(children: AuctionLabelChildren, auction: Auction) {
  return React.isValidElement(children)
    ? React.cloneElement(children, { auction })
    : children;
}
