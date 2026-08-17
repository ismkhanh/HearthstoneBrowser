import { AppError } from '../../../../core/errors/AppError';
import type { CardDetails } from '../entities/Card';
import type { CardRepository } from '../repositories/CardRepository';

export type GetCardBySlugUseCase = (slug: string, signal?: AbortSignal) => Promise<CardDetails>;

/** Slugs can arrive from a deep link, so an empty one fails here instead of hitting the API. */
export function createGetCardBySlugUseCase(repository: CardRepository): GetCardBySlugUseCase {
  return (slug, signal) => {
    const trimmedSlug = slug.trim();

    if (!trimmedSlug) {
      return Promise.reject(
        new AppError('notFound', 'We could not find what you were looking for.'),
      );
    }

    return repository.getCardBySlug(trimmedSlug, signal);
  };
}
