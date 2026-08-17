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
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebouncedValue(searchTerm);
  // Android is edge-to-edge: the list scrolls behind the transparent system
  // bar, so its content needs the bottom inset to end clear of it.
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
  } = useCardsQuery(debouncedSearchTerm);

  // Loading from the searcher's point of view: a long-enough term whose
  // results are not on screen yet (debounce still pending, or fetch running).
  const isSearchLoading =
    searchTerm.trim().length >= MIN_SEARCH_LENGTH &&
    (searchTerm !== debouncedSearchTerm || isPlaceholderData);

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
      <CardSearchBar value={searchTerm} onChange={setSearchTerm} isLoading={isSearchLoading} />
      <View style={styles.listContainer}>{renderContent()}</View>
    </View>
  );

  function renderContent() {
    if (isPending) {
      return <LoadingState label="Loading cards…" />;
    }

    if (isError) {
      return <ErrorState error={error} onRetry={() => { refetch(); }} />;
    }

    if (cards.length === 0) {
      return (
        <EmptyState
          message={
            debouncedSearchTerm ? 'No cards match your search.' : 'No cards available right now.'
          }
        />
      );
    }

    return (
      <FlashList
        testID="card-list"
        data={cards}
        // Slugs repeat within a page (the API lists each printing separately),
        // so the unique row identity is the numeric id, not the slug.
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
