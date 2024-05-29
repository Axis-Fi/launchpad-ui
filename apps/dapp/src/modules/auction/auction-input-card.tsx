import React from "react";
import { Card } from "@repo/ui";
import type { PropsWithAuction } from "@repo/types";

type AuctionInputCardProps = PropsWithAuction &
  React.HTMLAttributes<HTMLButtonElement> & {
    title?: React.ReactNode;
  };

export function AuctionInputCard(props: AuctionInputCardProps) {
  return (
    <Card title={props.title ? props.title : "Place your bid"}>
      <div className="mt-4">{props.children}</div>
    </Card>
  );
}
