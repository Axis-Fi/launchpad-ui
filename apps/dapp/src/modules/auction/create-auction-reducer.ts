import React from "react";
import type { Token } from "src/types";

export type CreateAuctionState = {
  quoteToken?: Token;
  payoutToken?: Token;
  chainId?: number;
  amount?: number;
  minPrice?: number;
  deadline?: Date;
  hooks?: string;
  allowlist?: string;
  isVested?: boolean;
  vestingDays?: number;
};

enum Actions {
  UPDATE_QUOTE_TOKEN = "update_quote_token",
  UPDATE_PAYOUT_TOKEN = "update_payout_token",
  UPDATE_CHAIN_ID = "update_chain_id",
  UPDATE_AMOUNT = "update_amount",
  UPDATE_MIN_PRICE = "update_min_price",
  UPDATE_DEADLINE = "update_deadline",
  UPDATE_HOOKS = "update_hooks",
  UPDATE_ALLOWLIST = "update_allowlist",
  UPDATE_DERIVATIVE_VESTING = "update_derivative_vesting",
}

type Action =
  | { type: Actions.UPDATE_QUOTE_TOKEN; value: Token }
  | { type: Actions.UPDATE_PAYOUT_TOKEN; value: Token }
  | { type: Actions.UPDATE_CHAIN_ID; value: number }
  | { type: Actions.UPDATE_AMOUNT; value: number }
  | { type: Actions.UPDATE_MIN_PRICE; value: number }
  | { type: Actions.UPDATE_DEADLINE; value: Date }
  | { type: Actions.UPDATE_HOOKS; value: string }
  | { type: Actions.UPDATE_ALLOWLIST; value: string }
  | {
      type: Actions.UPDATE_DERIVATIVE_VESTING;
      value: { isVested?: boolean; days?: number };
    };

const reducer = (
  state: CreateAuctionState,
  action: Action,
): CreateAuctionState => {
  const { type, value } = action;
  console.log(type, value, state);

  switch (type) {
    case Actions.UPDATE_QUOTE_TOKEN: {
      return { ...state, quoteToken: value };
    }
    case Actions.UPDATE_PAYOUT_TOKEN: {
      return { ...state, payoutToken: value };
    }

    case Actions.UPDATE_CHAIN_ID: {
      return {
        ...state,
        chainId: value,
        payoutToken: undefined,
        quoteToken: undefined,
      };
    }

    case Actions.UPDATE_AMOUNT: {
      return { ...state, amount: value };
    }

    case Actions.UPDATE_MIN_PRICE: {
      return { ...state, minPrice: value };
    }

    case Actions.UPDATE_DEADLINE: {
      return { ...state, deadline: value };
    }

    case Actions.UPDATE_HOOKS: {
      return { ...state, hooks: value };
    }

    case Actions.UPDATE_ALLOWLIST: {
      return { ...state, allowlist: value };
    }

    case Actions.UPDATE_DERIVATIVE_VESTING: {
      return {
        ...state,
        ...value,
      };
    }
  }
};

const initialState: CreateAuctionState = {};

export function useCreateAuctionReducer() {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return { state, dispatch, actions: Actions };
}
