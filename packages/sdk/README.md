# TODO

1. Determine if SDK types should live in this package or in existing `types` package
2. Start adding unit tests after receiving feedback from the team on this approach
3. Add a React useSdk() hook to make it simple to use the SDK in React apps
4. Add docs folder, autogenerate docs from tsdoc comments
5. Create README.md
6. Test using various wallet types (MM/Frame/WalletConnect/Safe etc.) (see what we can automate)
7. Add an examples folder
8. Move sdk out of packages and into its own repo so we can release it indepedently of the rest of the frontend
9. Look into what a bare minimal wagmi and ethers adapter would look like for dispatching the rpc call using the SDK config response via a wagmi or ethers instance (determine whether it's worth adding)
10. Check for any TODO comments left in the codebase

# Questions for team

1. Do we really need to enable consumers to get contract config from both primed and unprimed parameters? Does having both options make the API more confusing, or is it worth while to enable consumers to prime their parameters how they like, and maintain a pure function vs side-effecty function? IMO we should stop exposing primed methods and assume they'll always supply unprimed parameters (removes getXConfig methods from top level API, only expose side-effecty methods)
2. Is there anything you'd like to add to the TODO list?

# Example consumer usage (React, wagmi)

```js
import { usePermit2 } from "axis/hooks/whatever..."
import { useSdk } from "axis/origin-sdk/react"

export const BidExample = () => {
  const { quoteToken, contractAddresses } = useSdk(sdk => sdk.getAuction(...))

  const { isPermit2Approved, handleSignPermit } = usePermit2(
    quoteToken.address,
    contractAddresses.auctionHouse
  )

  const { status, config, error, issues } = useSdk(sdk => sdk.bid(...))

  const { writeContract } = useWriteContract()

  const handleApprove = () => handleSignPermit(...)

  const handleBid = async () => {
    writeContract({
      abi: config.abi,
      address: config.address,
      functionName: config.functionName,
      args: config.args
    })
  }

  return (
    <>
      {status === "fail" && <div>{error} {issues}</div>}
      <input for amountIn />
      <input for amountOut />
      <button disabled={isPermit2Approved} onClick={handleApprove}>Approve</button>
      <button disabled={!isPermit2Approved} onClick={handleBid}>Bid</button>
    </>
  )
}
```

# Example consumer usage (React, Ethers)

```js
// TODO
const contract = new Contract(config.address, config.abi, provider);
const result = await contract[config.functionName](...config.args);
```

# Example consumer usage (Vue)

```js
// TODO
```
