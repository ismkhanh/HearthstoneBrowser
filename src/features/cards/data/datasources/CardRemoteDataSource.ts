import type { HttpClient } from '../../../../core/network/httpClient';
import type { GetCardsParams } from '../../domain/repositories/CardRepository';
import type { CardsResponseDto } from '../dto/CardDto';

export interface CardRemoteDataSource {
  fetchCards(params: GetCardsParams, signal?: AbortSignal): Promise<CardsResponseDto>;
  fetchCardBySlug(slug: string, signal?: AbortSignal): Promise<unknown>;
}

export function createCardRemoteDataSource(http: HttpClient): CardRemoteDataSource {
  return {
    fetchCards({ page, pageSize, search }, signal) {
      return http.get<CardsResponseDto>('/cards', {
        params: { page, pageSize, ...(search ? { search } : {}) },
        signal,
      });
    },

    fetchCardBySlug(slug, signal) {
      return http.get<unknown>(`/cards/${encodeURIComponent(slug)}`, { signal });
    },
  };
}
