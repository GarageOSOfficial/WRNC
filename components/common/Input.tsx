import React from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';

export interface InputProps extends TextInputProps {
  label: string;
  error?: string;
}

/** Common labeled text input with inline validation error, shared across forms. */
export function Input({ label, error, ...props }: InputProps) {
  return (
    <View className="mb-4">
      <Text className="mb-1 text-sm font-medium text-wrnc-text-secondary">{label}</Text>
      <TextInput
        accessibilityLabel={label}
        className={`rounded-md border bg-wrnc-background px-3 py-2 text-base text-wrnc-text-primary ${
          error ? 'border-semantic-error' : 'border-wrnc-border'
        }`}
        placeholderTextColor="#C0C0C0"
        {...props}
      />
      {error ? <Text className="mt-1 text-xs text-semantic-error">{error}</Text> : null}
    </View>
  );
}
