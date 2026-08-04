# Build Passport™ architecture

## Overview

Build Passport™ is the flagship WRNC feature and a read-only aggregation layer that combines the existing Vehicle, Activity, Timeline, Document, and Documentation Score™ domains into a single vehicle history view.

The feature does not introduce new persistence, duplicate storage, or separate business rules. It computes its output from the current domain records at read time.

## Aggregation strategy

- `types/buildPassport.ts` defines the read-only Passport contract.
- `services/buildPassport.ts` derives the Passport view model from the vehicle, activity list, document list, and Documentation Score™ result.
- `hooks/useBuildPassport.ts` composes the existing domain hooks and memoizes the Passport result.
- The Passport service only summarizes data. It does not mutate records or own any state.

## Navigation model

- The Passport screen is vehicle-scoped at `/vehicle/[id]/passport`.
- Vehicle summary actions return to the current workspace context.
- Timeline summary actions navigate to the existing timeline and activity detail routes.
- Documentation summary actions navigate to the read-only document source view at `/vehicle/[id]/documents`.
- Recommendations are linked to the most relevant source section instead of duplicating record content.

## Testing strategy

- Service tests validate the aggregation output, category mapping, source-link generation, and statistics.
- Hook tests validate that the Passport hook composes the existing domain hooks and returns the aggregated model.
- Component tests validate the Passport section cards render the derived data and navigation actions.