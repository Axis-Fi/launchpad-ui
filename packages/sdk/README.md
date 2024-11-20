# Axis SDK

Convenience library for interacting with the Axis protocol.

## Quickstart

```bash
pnpm add @axis/sdk react viem @tanstack/react-query
```

## Initialize the SDK

```ts sdk.ts
import { createSdk } from "@axis/sdk";

export const sdk = createSdk();
```

## Wrap app in `<OriginSdkProvider />`

```tsx app.tsx
import { sdk } from "./sdk";
import { OriginSdkProvider } from "@axis/sdk/react";

export const App = () => (
  <OriginSdkProvider sdk={sdk}>
    <>{/* ... */}</>
  </OriginSdkProvider>
);
```

## Use the SDK

### Queries

Queries return the standard [`@tanstack/react-query`](https://tanstack.com/query/latest) [`useQuery()` result type](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery).

```tsx launch.tsx
import { useLaunchQuery } from "@axis/sdk/react";

export const Launch = () => {
  const {
    data: launch,
    status,
    error,
  } = useLaunchQuery({ chainId: 1, lotId: 1 });

  if (status === "pending") {
    return <div>Loading launch data...</div>;
  }

  if (status === "error") {
    return <div>Error resolving launch: {error.message}</div>;
  }

  return (
    <div>
      <h1>{launch.info.name}</h1>
      <p>{launch.info.description}</p>
    </div>
  );
};
```

### Contract calls

Contract calls [return a common interface](./src/react/hooks/use-axis-transaction.ts) for Axis contract interactions.

```tsx bid.tsx
import { useBid } from "@axis/sdk/react";

export const Bid = () => {
  import { useBid } from "@axis/sdk/react";
  import type { BidParams } from "@axis/sdk";
  import { formatUnits } from "viem";

  const bidParams: BidParams = {
    chainId: 1,
    lotId: 1,
    amountIn: 10000000000000000000n,
    amountOut: 20000000000000000000n,
    bidderAddress: "0x123...",
    referrerAddress: "0x456...",
  };

  const { submit, simulation, transaction, receipt, isWaiting, error } =
    useBid(bidParams);

  return (
    <div>
      {isWaiting && <div>Confirming bid transaction...</div>}
      {error && <div>Transaction error: {error.message}</div>}
      You're spending {formatUnits(bidParams.amountIn, 18)}
      <button disabled={isWaiting} onClick={submit}>
        Bid
      </button>
    </div>
  );
};
```

## React Hooks

```bash
.
└── src/
   ├── react/
   │   └── hooks/
   │       ├── use-abort.ts
   │       ├── use-bid.ts
   │       ├── use-cancel.ts
   │       ├── use-claim-bids.ts
   │       ├── use-refund-bid.ts
   │       ├── use-settle.ts
   │       ├── use-launch-query.ts
   │       └── use-launches-query.ts
   └── index.ts
```

## For Axis protocol integrators

By default, the SDK has default services for the following:

- Cloak: Service for encrypting bids offchain
- Metadata: Service for storing launch metadata offchain (e.g. name, description, image URLs...)
- Subgraph: Service for querying launch graph data (combines onchain data with offchain data)

You can override these services by passing in your own URLs in the SDK config:

```ts sdk.ts
import { createSdk } from "@axis/sdk";

export const sdk = createSdk({
  cloak: {
    url: "https://cloak.example.com/api",
  },
  metadata: {
    url: "https://metadata.example.com/api",
  },
  subgraph: {
    1: {
      url: "https://mainnet-subgraph.example.com/api",
    },
    81457: {
      url: "https://blast-subgraph.example.com/api",
    },
  },
});
```

# Resources

- [Axis Docs](https://docs.axis.finance/)
- [Axis Discord](https://discord.gg/5ugMgM9bvd)
- [Axis GitHub](https://github.com/axis-fi)
