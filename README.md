# Axis Frontend

Monorepo for Axis Finance Frontend Apps using [turbo](https://turbo.build/repo)

## Dev Setup

- run `pnpm install` to install dependencies for all packages
- Setup `.env` on dapp repo
- run `pnpm dev --filter=dapp`

### Other Useful Commands

- `pnpm build` - Build all packages
- `pnpm dev` - Run all packages locally
- `pnpm dev --filter=<project_name>` - Run a specific package locally
- `pnpm storybook` - Runs storybook locally
- `pnpm lint` - Lint all packages
- `pnpm format` - Format all packages
- `pnpm clean` - Clean up all `node_modules` and `dist` folders (runs each package's clean script)

## Apps & Packages

This Turborepo includes the following packages and applications:

- `apps/dapp`: Decentralized App to interact with Axis contracts
- `apps/lp`: Static Landing Page for Axis
- `apps/ipfs-api`: Proxy API for an IPFS gateway
- `packages/abis`: Protocol's contract abis
- `packages/deployments`: Metadata and configuration for the protocol's chain deployments
- `packages/ui`: Primitive React components built using [shadcn](https://ui.shadcn.com/)
- `packages/subgraph-client`: Subgraph client and queries
- `packages/brand-assets`: Axis brand images and fonts
- `packages/types`: Common TS types
- `config/tailwind-config`: Shared TailwindCSS configs
- `config/typescript-config`: Shared `tsconfig.json`s used throughout the Turborepo
- `config/eslint-config`: ESLint preset
