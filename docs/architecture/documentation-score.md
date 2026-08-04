# Documentation Score™ architecture

## Overview

Documentation Score™ is a read-only scoring engine that evaluates how complete a vehicle's documentation footprint is using existing vehicle, activity, and document data.

## Scoring methodology

The engine calculates an overall score from 0 to 100 and produces category-level scores for the documented categories:

- Vehicle Information
- Activity History
- Maintenance Records
- Photos
- Receipts
- Registration
- Insurance
- Warranty Documents
- Manuals
- Titles

Each category is evaluated from existing records only. The engine does not own or duplicate any application data.

## Testing strategy

The scoring engine is covered by unit tests for scoring, recommendations, service behavior, hook behavior, and component rendering.
