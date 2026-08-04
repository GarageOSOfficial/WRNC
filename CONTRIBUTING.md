# Contributing to WRNC

This repository is maintained for WRNC by Swear Like A Sailor, LLC. Contributions should support the product identity, maintain engineering quality, and avoid unnecessary churn.

## Governance entry point

The repository governance documentation lives in [docs/governance](docs/governance). Start there for workflow, review, release, and maintenance standards.

## Principles

- Keep the experience aligned with WRNC and Build Passport™
- Favor clarity over feature sprawl
- Preserve existing architecture and data contracts
- Keep documentation and workflow guidance consistent with current practice

## Workflow

1. Create a branch from main using the branch naming guidance in [docs/governance/branch-naming.md](docs/governance/branch-naming.md)
2. Make focused changes that match the sprint scope
3. Run npm test and npm run lint before opening a pull request
4. Update documentation when workflow, standards, or repository guidance change

## Pull request expectations

- Summarize the change and its purpose
- Note any documentation or workflow updates
- Reference related issues when applicable
- Keep the diff focused on the requested scope
- Follow the standards in [docs/governance/pull-request-standards.md](docs/governance/pull-request-standards.md)
