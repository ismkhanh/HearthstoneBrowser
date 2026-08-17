import React, { useMemo } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { theme } from '../../../../shared/theme/theme';
import type { CardDetails } from '../../domain/entities/Card';

export function CardDetailsView({ card }: { card: CardDetails }) {
  const insets = useSafeAreaInsets();
  const contentStyle = useMemo(
    () => [styles.content, { paddingBottom: theme.spacing.lg + insets.bottom }],
    [insets.bottom],
  );

  return (
    <ScrollView contentContainerStyle={contentStyle} testID="card-details">
      {card.imageUrl ? (
        <Image
          accessibilityLabel={`${card.name} artwork`}
          source={{ uri: card.imageUrl }}
          style={styles.image}
          resizeMode="contain"
        />
      ) : null}

      <Text style={styles.name}>{card.name}</Text>

      <View style={styles.statsRow}>
        <Attribute label="Mana" value={formatNumber(card.manaCost)} />
        <Attribute label="Attack" value={formatNumber(card.attack)} />
        <Attribute label="Health" value={formatNumber(card.health)} />
      </View>

      <Attribute label="Type" value={card.cardType} />
      <Attribute label="Class" value={card.className} />
      <Attribute label="Rarity" value={card.rarity} />
      <Attribute label="Set" value={card.cardSetName} />
      <Attribute label="Artist" value={card.artistName} />
      <Attribute label="Text" value={card.text} />
      <Attribute label="Flavor" value={card.flavorText} />

      {/* todo: check if list is required for keywords, i am assuming it is small, so not required */}
      {card.keywords.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Keywords</Text>
          {card.keywords.map(keyword => (
            <Text key={keyword.name} style={styles.value}>
              {keyword.name}: {keyword.description}
            </Text>
          ))}
        </View>
      ) : null}
    </ScrollView>
  );
}

function Attribute({ label, value }: { label: string; value: string | null }) {
  if (!value) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

function formatNumber(value: number | null): string | null {
  return value === null ? null : String(value);
}

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
  },
  image: {
    alignSelf: 'center',
    height: 380,
    width: '100%',
  },
  name: {
    color: theme.colors.text,
    fontSize: theme.fontSize.heading,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.xl,
  },
  section: {
    gap: theme.spacing.xs,
  },
  sectionTitle: {
    color: theme.colors.accent,
    fontSize: theme.fontSize.caption,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  value: {
    color: theme.colors.text,
    fontSize: theme.fontSize.body,
    lineHeight: 20,
  },
});
