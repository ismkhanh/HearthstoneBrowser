import type { CardDetails, CardsPage } from '../entities/Card';

export interface GetCardsParams {
  readonly page: number;
  readonly pageSize: number;
  /** Server-side, case-insensitive name search. Empty means "all cards". */
  readonly search?: string;
}

/**
 * Port owned by the domain layer; implemented in `data`.
 * The presentation layer only ever sees this interface.
 */
export interface CardRepository {
  getCards(params: GetCardsParams, signal?: AbortSignal): Promise<CardsPage>;
  getCardBySlug(slug: string, signal?: AbortSignal): Promise<CardDetails>;
}
