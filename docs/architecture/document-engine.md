# WRNC-004 Document Engine

## Overview

The Document Engine is the centralized document management domain for WRNC. Every uploaded artifact becomes a document and can be associated with a vehicle, an activity, or both, supporting the broader WRNC documentation experience and Build Passport™ summaries.

## Relationships

- A workspace owns many documents.
- A vehicle may have many documents.
- An activity may have many documents.
- Documents are soft-deleted with an archived_at timestamp.

## Validation strategy

Document creation and updates use shared validators in utils/validators.ts. Validation covers:

- required title
- required document type
- required file URL
- supported MIME type
- positive file size

## Testing approach

The document domain uses Jest for:

- validator coverage
- service-layer CRUD behavior
- React Query hook invalidation paths
- archive and restore flows
