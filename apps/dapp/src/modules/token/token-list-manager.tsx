import { Avatar, Input, LabelWrapper, Switch } from "@repo/ui";
import { TokenList } from "src/types/token-types";

type TokenListManagerProps = {
  tokenlists: TokenList[];
};
export function TokenListManager(props: TokenListManagerProps) {
  return (
    <div>
      <LabelWrapper content="Token List URL">
        <Input placeholder="https://" />
      </LabelWrapper>
      <div className="mt-4">
        {props.tokenlists.map((t, i) => (
          <TokenListDisplay key={i} tokenList={t} />
        ))}
      </div>
    </div>
  );
}

type TokenListDisplayProps = {
  tokenList: TokenList;
  isActive: boolean;
  onToggle: (tokenlist: TokenList, active: boolean) => void;
};

function TokenListDisplay({ tokenList, ...props }: TokenListDisplayProps) {
  return (
    <div className="bg-secondary flex w-[320px] items-center justify-between gap-x-2 rounded-sm p-4 py-2">
      <div className="flex items-center gap-x-2">
        <Avatar
          className="size-10"
          src={tokenList.logoURI}
          alt={tokenList.name}
        />
        <div className="flex flex-col">
          <p>{tokenList.name}</p>
          <p className="text-muted-foreground text-xs">
            {tokenList.tokens.length} Tokens{" "}
          </p>
        </div>
      </div>

      <Switch
        checked={props.isActive}
        onCheckedChange={(active) => props.onToggle(tokenList, active)}
      />
    </div>
  );
}
