# Contributing to WRNC

This repository is maintained for WRNC by Swear Like A Sailor, LLC. Contributions should support the product identity, maintain engineering quality, and avoid unnecessary churn.

## Principles

- Keep the experience aligned with WRNC and Build Passport™
- Favor clarity over feature sprawl
- Preserve existing architecture and data contracts
- Keep documentation and metadata consistent with the brand

## Workflow

1. Create a feature branch from main
2. Make focused changes that match the sprint scope
3. Run npm test and npm run lint before opening a pull request
4. Update documentation when terminology, workflows, or metadata change

## Branch strategy

- main: release-ready state
- feature/<ticket>-<description>: scoped work
- docs/<description>: documentation-only work
- chore/<description>: infrastructure and maintenance work

## Pull request expectations

- Summarize the change and its purpose
- Note any documentation or metadata updates
- Reference related issues when applicable
- Keep the diff focused on the requested scope
