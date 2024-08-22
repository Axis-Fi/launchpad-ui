# Axis Deployments

This repo contains all the data that describes an Axis Deployment per chain. This includes Axis contract addresses, chain and token metadata and a subgraph configuration.

For chains we extend [viem's chain definition](https://viem.sh/docs/chains/introduction.html)

## Adding deployments

- Create a new file with the network name in the corresponding dir on the project root (`./testnets` or `./mainnets`)
- Add the required information
- Add your file to its directory index.ts
- ???
- Done

## Syncing contract addresses

Ensure axis-core and axis-periphery are sibling directories to this monorepo and have the latest verion.
Run `pnpm sync` on this directory.
This script will take the latest version of the deployment jsons and update them here.
