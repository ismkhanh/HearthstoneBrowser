import type { HttpClient } from '../../../../core/network/httpClient';
import { toAppError } from '../../../../core/network/toAppError';
import type { GetCardsParams } from '../../domain/repositories/CardRepository';
import { CardDtoSchema, type CardDto, type CardsResponseDto } from '../dto/CardDto';

/** Knows the HTTP routes and nothing else. */
export interface CardRemoteDataSource {
  fetchCards(params: GetCardsParams, signal?: AbortSignal): Promise<CardsResponseDto>;
  fetchCardBySlug(slug: string, signal?: AbortSignal): Promise<CardDto>;
}

export function createCardRemoteDataSource(http: HttpClient): CardRemoteDataSource {
  return {
    fetchCards({ page, pageSize, search }, signal) {
      return http.get<CardsResponseDto>('/cards', {
        params: { page, pageSize, ...(search ? { search } : {}) },
        signal,
      });
    },

    // The detail payload feeds the UI directly, so it is validated here;
    // list items are validated one by one in the mapper instead, where a
    // single bad card can be dropped without discarding the whole page.
    async fetchCardBySlug(slug, signal) {
      const payload = await http.get<unknown>(`/cards/${encodeURIComponent(slug)}`, { signal });

      try {
        return CardDtoSchema.parse(payload);
      } catch (error) {
        throw toAppError(error);
      }
    },
  };
}
