import React from 'react';
import { EmptyState } from '../common/EmptyState';

export interface VehicleTimelineEmptyStateProps {
  onCreateActivity: () => void;
}

export function VehicleTimelineEmptyState({
  onCreateActivity,
}: VehicleTimelineEmptyStateProps) {
  return (
    <EmptyState
      title="No activities yet"
      message="Create the first activity to start the vehicle timeline."
      actionLabel="Create Activity"
      onAction={onCreateActivity}
    />
  );
}