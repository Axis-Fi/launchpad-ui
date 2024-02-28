import { Token } from "@repo/deployments/src/types";
import {
  DialogContent,
  DialogHeader,
  DialogRoot,
  IconedLabel,
  ScrollArea,
  trimAddress,
} from "@repo/ui";

type TokenSelectDialogProps = {
  tokens: Token[];
  onSelect: (token: Token) => void;
};

export function TokenSelectDialog(props: TokenSelectDialogProps) {
  return (
    <DialogRoot open={true}>
      <DialogContent className="max-w-sm">
        <DialogHeader>Select Token</DialogHeader>
        <div>
          <ScrollArea className="h-[300px]">
            {props.tokens.map((t, i) => (
              <TokenSelectRow key={i} token={t} />
            ))}
          </ScrollArea>
        </div>
      </DialogContent>
    </DialogRoot>
  );
}

function TokenSelectRow({ token }: { token: Token }) {
  return (
    <div className="border-muted hover:bg-secondary flex cursor-pointer items-center justify-between gap-x-2 border-x border-t p-1 py-2 first:rounded-t-sm last:rounded-b-sm last:border-b">
      <IconedLabel src={token.logoURI} label={token.symbol} />
      <p className="text-muted-foreground text-xs">
        {trimAddress(token.address, 8)}
      </p>
    </div>
  );
}
