import type { CardsPage } from '../entities/Card';
import type { CardRepository, GetCardsParams } from '../repositories/CardRepository';

export const DEFAULT_PAGE_SIZE = 20;

export const MIN_SEARCH_LENGTH = 3;

export type GetCardsUseCase = (
  params: Partial<GetCardsParams>,
  signal?: AbortSignal,
) => Promise<CardsPage>;

// by default fetches the cards list with a page size of 20, if search query present searches for cards using the query
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
