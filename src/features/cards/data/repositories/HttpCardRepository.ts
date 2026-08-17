import { toAppError } from '../../../../core/network/toAppError';
import type { CardDetails, CardsPage } from '../../domain/entities/Card';
import type { CardRepository, GetCardsParams } from '../../domain/repositories/CardRepository';
import type { CardRemoteDataSource } from '../datasources/CardRemoteDataSource';
import { CardDtoSchema } from '../dto/CardDto';
import { toCardDetails, toCardsPage } from '../mappers/cardMapper';

export function createHttpCardRepository(remote: CardRemoteDataSource): CardRepository {
  return {
    async getCards(params: GetCardsParams, signal?: AbortSignal): Promise<CardsPage> {
      try {
        const response = await remote.fetchCards(params, signal);
        return toCardsPage(response, params.page);
      } catch (error) {
        throw toAppError(error);
      }
    },

    async getCardBySlug(slug: string, signal?: AbortSignal): Promise<CardDetails> {
      try {
        const payload = await remote.fetchCardBySlug(slug, signal);
        return toCardDetails(CardDtoSchema.parse(payload));
      } catch (error) {
        throw toAppError(error);
      }
    },
  };
}
