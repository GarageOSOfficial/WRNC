# Development Workflow

## Standard workflow

1. Create a branch from main.
2. Implement the requested work in a focused change set.
3. Update related documentation when behavior, workflow, or standards change.
4. Run local verification commands before opening a pull request.
5. Open a pull request with a clear summary, testing notes, and scope details.
6. Address review feedback and merge only after the change is ready.

## Local verification

Before opening a pull request, run:

- npm test
- npm run lint

## Change scope

Changes should be limited to the issue or task being addressed. Avoid unrelated refactors, large formatting changes, or feature expansion during governance or documentation work.
