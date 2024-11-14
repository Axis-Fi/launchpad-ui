# Axis Frontend Utilities

Monorepo for Axis Finance frontend utilities [turbo](https://turbo.build/repo)

## Dev Setup

- run `pnpm install` to install dependencies for all packages

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

- `apps/ipfs-api`: Proxy API for an IPFS gateway
- `packages/abis`: Protocol's contract abis
- `packages/cloak`: Key management API
- `packages/deployments`: Metadata and configuration for the protocol's chain deployments
- `packages/env`: Shared environment configuration
- `packages/sdk`: JS Library for interacting with Axis contracts and subgraphs
- `packages/subgraph-client`: Subgraph client and queries
- `packages/types`: Common TS types
- `config/tailwind-config`: Shared TailwindCSS configs
- `config/typescript-config`: Shared `tsconfig.json`s used throughout the Turborepo
- `config/eslint-config`: ESLint preset
