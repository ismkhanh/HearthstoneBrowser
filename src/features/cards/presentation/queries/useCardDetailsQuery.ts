import { useQuery } from '@tanstack/react-query';

import type { CardDetails } from '../../domain/entities/Card';
import { useCardsUseCases } from '../../providers/CardsUseCasesProvider';
import { cardQueryKeys } from './cardQueryKeys';

export function useCardDetailsQuery(slug: string) {
  const { getCardBySlug } = useCardsUseCases();

  return useQuery<CardDetails>({
    queryKey: cardQueryKeys.detail(slug),
    queryFn: ({ signal }) => getCardBySlug(slug, signal),
    enabled: slug.length > 0,
    // Deliberately not seeded with placeholder data from the list cache: the
    // list only carries the wide crop image, which painted letterboxed before
    // the real card art arrived. The header already shows the name via route
    // params, so a brief spinner reads better than a half-filled layout.
  });
}
