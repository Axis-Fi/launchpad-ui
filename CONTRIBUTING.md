# Contributing to Axis launchpad

> Axis launchpad is a UI kit for bootstrapping your own token launchpad with multichain support. It provides a user interface for enabling the creation of token sales and participation in the sales. It interacts with the [Axis smart contracts](https://github.com/Axis-Fi/axis-core) and the [Axis Subgraph](https://github.com/Axis-Fi/subgraph) for querying token sales data.

Thank you for your interest in contributing to Axis `launchpad`. This guide will help you understand our development process and how to contribute effectively.

## Project Structure

Turbo monorepo structure.

```
.
├── apps/
│   ├── config/       # shared configs e.g. tailwind
│   └── dapp/
│   │   └── cypress/  # e2e tests
│   │   └── public/   # static assets
│   │   └── src/      # dapp source code
│   │   └── test/     # test data
└── packages/         # shared packages
    ├── brand-assets/ # brand assets (fonts and images)
    └── ui/           # ui component library (shadcn)
```

# Contribution Process

1. Fork this repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (use semantic commits)
4. Push to your branch
5. Open a pull request to `develop`

## Code Consistency

- Use lower kebab-case for folders and filenames (e.g. `user-profile.ts`)
- Try to follow the major conventions you see elsewhere in the codebase

## Deployment Flow

- Merging to `develop` → Triggers testnet deployment
- Merging to `main` → Triggers mainnet deployment
- Merge your change into `develop` then merge `develop` into `main`

## Pull Request Requirements

- All tests should pass
- Code should follow project standards

## Merge Process

- Currently only Axis team members can merge PRs
- Contributor License Agreement (CLA) must be signed

# Development Workflow

## Branch Naming Convention

Use [semantic branch names](https://gist.github.com/seunggabi/87f8c722d35cd07deb3f649d45a31082) that describe the type of change:

- feat/feature-name - New features
- fix/bug-description - Bug fixes
- chore/task-description - Maintenance tasks
  Example: `fix/user-balance-race-condition`

## Commit Messages

Use [semantic commit messages](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716):

```
<type>: <description>
```

Examples:

```
fix: avoid race condition fetching users and balances
feat: add new staking interface
chore: update dependency versions
```

# Need Help?

- Join our [Discord community](https://discord.gg/tx9CrvPZWF)
- Check existing issues and pull requests
- Review our documentation

# License and CLA

- You must sign our Contributor License Agreement

# Related Repositories

- [Axis ui-libs](https://github.com/axis-fi/ui-libs/) - companion UI library repository

- [Axis tge](https://github.com/Axis-Fi/standalone-ui) - token launch UI kit for projects to self-host their own token sales which utilizes this repo's deployed subgraphs

- [Axis subgraph](https://github.com/Axis-Fi/subgraph) - subgraph for querying token sales data

Thank you for contributing! 🚀
