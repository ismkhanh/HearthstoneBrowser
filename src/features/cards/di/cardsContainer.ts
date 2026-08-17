import { createHttpClient } from '../../../core/network/httpClient';
import { createCardRemoteDataSource } from '../data/datasources/CardRemoteDataSource';
import { createHttpCardRepository } from '../data/repositories/HttpCardRepository';
import { createGetCardBySlugUseCase, type GetCardBySlugUseCase } from '../domain/usecases/getCardBySlug';
import { createGetCardsUseCase, type GetCardsUseCase } from '../domain/usecases/getCards';

/** The only thing the presentation layer is allowed to depend on. */
export interface CardsUseCases {
  readonly getCards: GetCardsUseCase;
  readonly getCardBySlug: GetCardBySlugUseCase;
}

/** Composition root for the cards feature: wiring happens once, here. */
export function createCardsUseCases(): CardsUseCases {
  const repository = createHttpCardRepository(createCardRemoteDataSource(createHttpClient()));

  return {
    getCards: createGetCardsUseCase(repository),
    getCardBySlug: createGetCardBySlugUseCase(repository),
  };
}
