import React from 'react';
import { Text, View } from 'react-native';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

/** Common empty state, shared across screens (e.g. no vehicles yet). */
export function EmptyState({ title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View className="items-center justify-center px-6 py-12">
      <Text className="mb-2 text-lg font-semibold text-gray-900">{title}</Text>
      {message ? <Text className="mb-4 text-center text-sm text-gray-500">{message}</Text> : null}
      {actionLabel && onAction ? <Button label={actionLabel} onPress={onAction} /> : null}
    </View>
  );
}
