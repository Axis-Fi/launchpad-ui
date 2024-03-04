import { TokenlistContext } from "./tokenlist-provider";
import React from "react";

export function useTokenLists() {
  return React.useContext(TokenlistContext);
}
