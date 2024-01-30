# Axis Frontend

Monorepo for Axis Finance Frontend Apps using [turbo](https://turbo.build/repo)

## Setup

- `pnpm install` - Install dependencies for all packages
- `pnpm build` - Build all packages locally

### Other Useful Commands

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
- `packages/ui`: Primitive React components
- `packages/tailwind-config`: Shared TailwindCSS configs
- `packages/typescript-config`: Shared `tsconfig.json`s used throughout the Turborepo
- `packages/eslint-config`: ESLint preset
