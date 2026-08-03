import React from 'react';
import { ActivityIndicator, Pressable, Text, type PressableProps } from 'react-native';

export interface ButtonProps extends PressableProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
}

const VARIANT_STYLES: Record<NonNullable<ButtonProps['variant']>, { bg: string; text: string }> = {
  primary: { bg: 'bg-blue-600', text: 'text-white' },
  secondary: { bg: 'bg-gray-200', text: 'text-gray-900' },
  danger: { bg: 'bg-red-600', text: 'text-white' },
};

/** Common primary action button, shared across screens. */
export function Button({ label, variant = 'primary', loading, disabled, ...props }: ButtonProps) {
  const styles = VARIANT_STYLES[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      disabled={disabled || loading}
      className={`items-center justify-center rounded-lg px-4 py-3 ${styles.bg} ${
        disabled || loading ? 'opacity-50' : ''
      }`}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text className={`font-semibold ${styles.text}`}>{label}</Text>
      )}
    </Pressable>
  );
}
