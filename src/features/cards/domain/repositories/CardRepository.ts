import type { CardDetails, CardsPage } from '../entities/Card';

export interface GetCardsParams {
  readonly page: number;
  readonly pageSize: number;
  readonly search?: string; //empty string is treated as no search
}

export interface CardRepository {
  getCards(params: GetCardsParams, signal?: AbortSignal): Promise<CardsPage>;
  getCardBySlug(slug: string, signal?: AbortSignal): Promise<CardDetails>;
}
