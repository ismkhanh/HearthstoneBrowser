import React, { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import FastImage from '@d11/react-native-fast-image';

import { theme } from '../../../../shared/theme/theme';
import type { CardSummary } from '../../domain/entities/Card';

interface CardListItemProps {
  card: CardSummary;
  onPress: (card: CardSummary) => void;
}

function CardListItemComponent({ card, onPress }: CardListItemProps) {
  const handlePress = useCallback(() => onPress(card), [card, onPress]);
  const subtitle = [card.cardType, card.className, card.rarity].filter(Boolean).join(' · ');

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={card.name}
      testID={`card-item-${card.slug}`}
      onPress={handlePress}
      style={styles.container}
    >
      {card.imageUrl ? (
        <FastImage
          source={{ uri: card.imageUrl }}
          style={styles.image}
          resizeMode={FastImage.resizeMode.cover}
        />
      ) : (
        <View style={[styles.image, styles.imageFallback]} />
      )}

      <View style={styles.details}>
        <Text numberOfLines={1} style={styles.name}>
          {card.name}
        </Text>
        {subtitle.length > 0 ? (
          <Text numberOfLines={1} style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

export const CardListItem = memo(CardListItemComponent);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.md,
  },
  image: {
    borderRadius: theme.radius.sm,
    height: 56,
    width: 56,
  },
  imageFallback: {
    backgroundColor: theme.colors.border,
  },
  details: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  name: {
    color: theme.colors.text,
    fontSize: theme.fontSize.title,
    fontWeight: '600',
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.caption,
  },
});
