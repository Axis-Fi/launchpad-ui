import React from "react";
import { TokenList, Token } from "src/types/token-types";
import { defaultTokenlist as axisTokenlist } from "@repo/deployments";

type ITokenlistContext = {
  lists: TokenList[];
  addList: (list: TokenList) => void;
  removeList: (list: TokenList) => void;
  toggleList: (list: TokenList, active: boolean) => void;
  getTokensByChainId: (chainId: number) => Token[];
};

const TokenlistContext = React.createContext<ITokenlistContext>(
  {} as ITokenlistContext,
);

export function TokenlistProvider(props: React.PropsWithChildren) {
  const [lists, setActiveLists] = React.useState<TokenList[]>([axisTokenlist]);

  const addList = (list: TokenList) => {
    if (!lists.some((l) => l.name === list.name)) {
      setActiveLists((prev) => [...prev, list]);
    }
  };

  const removeList = (list: TokenList) => {
    setActiveLists((prev) => prev.filter((l) => l.name !== list.name));
  };

  const toggleList = (list: TokenList, active: boolean) => {
    setActiveLists((prev) =>
      prev.map((l) => {
        if (l.name === list.name) {
          l.isActive = active;
        }
        return l;
      }),
    );
  };

  const getTokensByChainId = (chainId: number) => {
    return lists
      .filter((l) => l.isActive)
      .flatMap((t) => t.tokens)
      .filter((t) => t.chainId === chainId);
  };

  return (
    <TokenlistContext.Provider
      value={{
        lists: lists,
        addList,
        removeList,
        toggleList,
        getTokensByChainId,
      }}
    >
      {props.children}
    </TokenlistContext.Provider>
  );
}

export function useTokenLists() {
  return React.useContext(TokenlistContext);
}
