# Axis launchpad

Axis launchpad is a UI kit for bootstrapping your own token launchpad with multichain support. It provides a user interface for enabling the creation of token sales and participation in the sales. It interacts with the [Axis smart contracts](https://github.com/Axis-Fi/axis-core) and the [Axis Subgraph](https://github.com/Axis-Fi/subgraph) for querying token sales data.

## Setup

- run `pnpm install` to install dependencies for all packages
- Setup `.env` on dapp repo, see [.env.example](./apps/dapp/.env.example) for an example
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

- `apps/dapp`: UI for creating and participating in token sales
- `packages/brand-assets`: Axis brand images and fonts
- `packages/ui`: Axis UI component library (shadcn + tailwind)
- `config/tailwind-config`: Shared TailwindCSS configs

## Contributing

Thank you for your interest in contributing to Axis `launchpad`! Please read our [CONTRIBUTION.md](./CONTRIBUTING.md) guide to understand our development process and how to contribute effectively.
