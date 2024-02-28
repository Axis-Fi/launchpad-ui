import React from "react";
import { TokenList } from "src/types/token-types";

type AppTokenList = TokenList & {
  isActive: boolean;
  chainId: number;
};

type ITokenlistContext = {
  activeLists: AppTokenList[];
  addList: (list: AppTokenList) => void;
  removeList: (list: AppTokenList) => void;
  toggleList: (list: AppTokenList) => void;
};

const TokenlistContext = React.createContext<ITokenlistContext>(
  {} as ITokenlistContext,
);

export function TokenlistProvider(props: React.PropsWithChildren) {
  const [activeLists, setActiveList] = React.useState<AppTokenList[]>([]);

  const addList = (list: AppTokenList) => {
    setActiveList((prev) => [...prev, list]);
  };

  const removeList = (list: AppTokenList) => {
    setActiveList((prev) => prev.filter((l) => l.name !== list.name));
  };

  const toggleList = (list: AppTokenList) => {
    setActiveList((prev) =>
      prev.map((l) => {
        if (l.name === list.name) l.isActive = !l.isActive;

        return l;
      }),
    );
  };

  return (
    <TokenlistContext.Provider
      value={{ activeLists, addList, removeList, toggleList }}
    >
      {props.children}
    </TokenlistContext.Provider>
  );
}

export function useTokenLists() {
  return React.useContext(TokenlistContext);
}
