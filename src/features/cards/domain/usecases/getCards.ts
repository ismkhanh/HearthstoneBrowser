import type { CardsPage } from '../entities/Card';
import type { CardRepository, GetCardsParams } from '../repositories/CardRepository';

export const DEFAULT_PAGE_SIZE = 20;

/** Single-character searches match almost everything, so we wait for a real term. */
export const MIN_SEARCH_LENGTH = 3;

export type GetCardsUseCase = (
  params: Partial<GetCardsParams>,
  signal?: AbortSignal,
) => Promise<CardsPage>;

/** Owns the listing defaults: 1-based pages and a trimmed, optional search term. */
export function createGetCardsUseCase(repository: CardRepository): GetCardsUseCase {
  return (params, signal) => {
    const search = params.search?.trim() ?? '';

    return repository.getCards(
      {
        page: Math.max(1, params.page ?? 1),
        pageSize: params.pageSize ?? DEFAULT_PAGE_SIZE,
        search: search.length >= MIN_SEARCH_LENGTH ? search : undefined,
      },
      signal,
    );
  };
}
