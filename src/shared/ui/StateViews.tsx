import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { isAppError } from '../../core/errors/AppError';
import { theme } from '../theme/theme';

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <View style={styles.container} testID="loading-state">
      <ActivityIndicator color={theme.colors.accent} />
      <Text style={styles.message}>{label}</Text>
    </View>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <View style={styles.container} testID="empty-state">
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

interface ErrorStateProps {
  error: unknown;
  onRetry?: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const message = isAppError(error) ? error.message : 'Something went wrong.';

  return (
    <View style={styles.container} testID="error-state">
      <Text style={[styles.message, styles.errorMessage]}>{message}</Text>
      {onRetry ? (
        <Pressable accessibilityRole="button" style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryLabel}>Try again</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: theme.spacing.md,
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  message: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.body,
    textAlign: 'center',
  },
  errorMessage: {
    color: theme.colors.danger,
  },
  retryButton: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  retryLabel: {
    color: theme.colors.text,
    fontSize: theme.fontSize.body,
  },
});
