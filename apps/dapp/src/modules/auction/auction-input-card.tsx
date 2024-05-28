import { Card, Text } from "@repo/ui";
import { PropsWithAuction } from "@repo/types";
import { TransactionDialog } from "modules/transaction/transaction-dialog";

type AuctionInputCardProps = PropsWithAuction &
  React.HTMLAttributes<HTMLButtonElement> & {
    submitText: string | React.ReactNode;
    disabled?: boolean;
    showTrigger?: boolean;
    TriggerElement?: typeof TransactionDialog;
  };

export function AuctionInputCard({ ...props }: AuctionInputCardProps) {
  return (
    <Card>
      <div>
        <Text size="3xl" weight="light">
          Place your bid
        </Text>
        <div className="mt-4">{props.children}</div>
      </div>
    </Card>
  );
}
