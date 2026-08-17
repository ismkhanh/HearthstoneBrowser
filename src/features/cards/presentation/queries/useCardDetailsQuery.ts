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
    // todo: make use of list cache as placeholder optimally and without hampering ux, right now the transition is not clean
  });
}
