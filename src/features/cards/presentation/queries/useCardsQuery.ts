import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import type { CardSummary, CardsPage } from '../../domain/entities/Card';
import { DEFAULT_PAGE_SIZE, MIN_SEARCH_LENGTH } from '../../domain/usecases/getCards';
import { useCardsUseCases } from '../../providers/CardsUseCasesProvider';
import { cardQueryKeys } from './cardQueryKeys';

export function useCardsQuery(search: string) {
  const { getCards } = useCardsUseCases();

  // The use case ignores terms shorter than the minimum, so the cache key
  // ignores them too — typing "f" or "fi" keeps showing the unfiltered list
  // instead of refetching it under a new key.
  const trimmedSearch = search.trim();
  const effectiveSearch = trimmedSearch.length >= MIN_SEARCH_LENGTH ? trimmedSearch : '';

  const query = useInfiniteQuery({
    queryKey: cardQueryKeys.list(effectiveSearch),
    queryFn: ({ pageParam, signal }) =>
      getCards({ page: pageParam, pageSize: DEFAULT_PAGE_SIZE, search: effectiveSearch }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage: CardsPage) =>
      lastPage.page < lastPage.pageCount ? lastPage.page + 1 : undefined,
    placeholderData: keepPreviousData,
  });

  const cards = useMemo<CardSummary[]>(
    () => query.data?.pages.flatMap(page => page.cards) ?? [],
    [query.data],
  );

  // Explicit fields (not a spread): the query result is a tracked proxy, so
  // subscribing to only what the screen consumes avoids extra re-renders.
  return {
    cards,
    error: query.error,
    isPending: query.isPending,
    isError: query.isError,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    refetch: query.refetch,
    /** True while results for a changed search term are still on the way. */
    isPlaceholderData: query.isPlaceholderData,
  };
}
