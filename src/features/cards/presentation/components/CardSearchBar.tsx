import React from 'react';
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { theme } from '../../../../shared/theme/theme';

interface CardSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  /** True while a search request for the current term is in flight. */
  isLoading?: boolean;
}

export function CardSearchBar({ value, onChange, isLoading = false }: CardSearchBarProps) {
  const handleClear = () => {
    onChange('');
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          accessibilityLabel="Search cards"
          testID="card-search-input"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Search cards by name"
          placeholderTextColor={theme.colors.textMuted}
          returnKeyType="search"
          style={styles.input}
          value={value}
          onChangeText={onChange}
        />
        <View style={styles.accessory} pointerEvents="box-none">
          {renderAccessory()}
        </View>
      </View>
    </View>
  );

  function renderAccessory() {
    if (isLoading) {
      return (
        <ActivityIndicator color={theme.colors.accent} size="small" testID="search-loading" />
      );
    }

    if (value.length > 0) {
      return (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          testID="search-clear-button"
          hitSlop={theme.spacing.sm}
          onPress={handleClear}
        >
          <Text style={styles.clearIcon}>✕</Text>
        </Pressable>
      );
    }

    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: theme.spacing.md,
  },
  inputWrapper: {
    justifyContent: 'center',
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    color: theme.colors.text,
    fontSize: theme.fontSize.body,
    paddingHorizontal: theme.spacing.lg,
    // Keeps typed text clear of the loading / clear accessory.
    paddingRight: theme.spacing.xl + theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  accessory: {
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  clearIcon: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.title,
    fontWeight: '600',
  },
});
