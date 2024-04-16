# TODO

1. Add unit tests
2. Add a React useSdk() hook to make it simple to use the SDK in React apps
3. Add docs folder, autogenerate docs from tsdoc comments
4. Create README.md
5. Test using various wallet types (MM/Frame/WalletConnect/Safe etc.) (see what we can automate)
6. Add an examples folder / add examples to tsdoc comments
7. Move sdk out of packages and into its own repo so we can release it indepedently of the rest of the frontend
8. Look into what a bare minimal wagmi and ethers adapter would look like for dispatching the rpc call using the SDK config response via a wagmi or ethers instance (determine whether it's worth adding)
9. Check for any TODO comments left in the codebase
10. Licensing - figure out which license to give SDK, other frontend packages and main dapp

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
