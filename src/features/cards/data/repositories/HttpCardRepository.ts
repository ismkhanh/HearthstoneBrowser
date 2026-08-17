import type { CardDetails, CardsPage } from '../../domain/entities/Card';
import type { CardRepository, GetCardsParams } from '../../domain/repositories/CardRepository';
import type { CardRemoteDataSource } from '../datasources/CardRemoteDataSource';
import { toCardDetails, toCardsPage } from '../mappers/cardMapper';

export function createHttpCardRepository(remote: CardRemoteDataSource): CardRepository {
  return {
    async getCards(params: GetCardsParams, signal?: AbortSignal): Promise<CardsPage> {
      const response = await remote.fetchCards(params, signal);
      return toCardsPage(response, params.page);
    },

    async getCardBySlug(slug: string, signal?: AbortSignal): Promise<CardDetails> {
      const dto = await remote.fetchCardBySlug(slug, signal);
      return toCardDetails(dto);
    },
  };
}
