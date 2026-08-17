import React from 'react';
import { StyleSheet, View } from 'react-native';

import { theme } from '../../../../shared/theme/theme';
import { ErrorState, LoadingState } from '../../../../shared/ui/StateViews';
import { CardDetailsView } from '../components/CardDetailsView';
import { useCardDetailsQuery } from '../queries/useCardDetailsQuery';

export function CardDetailsScreen({ slug }: { slug: string }) {
  const { data: card, error, isPending, isError, refetch } = useCardDetailsQuery(slug);

  return (
    <View style={styles.container}>
      {isPending ? <LoadingState label="Loading card…" /> : null}
      {isError ? <ErrorState error={error} onRetry={() => { refetch(); }} /> : null}
      {card ? <CardDetailsView card={card} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
});
