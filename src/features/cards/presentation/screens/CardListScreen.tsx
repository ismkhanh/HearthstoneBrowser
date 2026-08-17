import { FlashList } from '@shopify/flash-list';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDebouncedValue } from '../../../../shared/hooks/useDebouncedValue';
import { theme } from '../../../../shared/theme/theme';
import { EmptyState, ErrorState, LoadingState } from '../../../../shared/ui/StateViews';
import type { CardSummary } from '../../domain/entities/Card';
import { MIN_SEARCH_LENGTH } from '../../domain/usecases/getCards';
import { CardListItem } from '../components/CardListItem';
import { CardSearchBar } from '../components/CardSearchBar';
import { useCardsQuery } from '../queries/useCardsQuery';

interface CardListScreenProps {
  onSelectCard: (card: CardSummary) => void;
}

export function CardListScreen({ onSelectCard }: CardListScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebouncedValue(searchQuery);
  const insets = useSafeAreaInsets();
  const listContentStyle = useMemo(() => ({ paddingBottom: insets.bottom }), [insets.bottom]);

  const {
    cards,
    error,
    isPending,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isPlaceholderData,
  } = useCardsQuery(debouncedSearchQuery);

  const isSearchLoading =
    searchQuery.trim().length >= MIN_SEARCH_LENGTH &&
    (searchQuery !== debouncedSearchQuery || isPlaceholderData);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const renderItem = useCallback(
    ({ item }: { item: CardSummary }) => <CardListItem card={item} onPress={onSelectCard} />,
    [onSelectCard],
  );

  return (
    <View style={styles.container}>
      <CardSearchBar value={searchQuery} onChange={setSearchQuery} isLoading={isSearchLoading} />
      <View style={styles.listContainer}>{renderContent()}</View>
    </View>
  );

  // show previously fetched list if next page fails
  function renderContent() {
    if (cards.length > 0) {
      return (
        <FlashList
          testID="card-list"
          data={cards}
          keyExtractor={card => String(card.id)}
          renderItem={renderItem}
          contentContainerStyle={listContentStyle}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator
                color={theme.colors.accent}
                style={styles.footer}
                testID="list-footer-loading"
              />
            ) : null
          }
        />
      );
    }

    if (isPending) {
      return <LoadingState label="Loading cards…" />;
    }

    if (isError) {
      return <ErrorState error={error} onRetry={() => { refetch(); }} />;
    }

    return (
      <EmptyState
        message={
          debouncedSearchQuery ? 'No cards match your search.' : 'No cards available right now.'
        }
      />
    );
  }

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },
  listContainer: {
    flex: 1,
  },
  footer: {
    paddingVertical: theme.spacing.lg,
  },
});
