import { AppError } from '../../../../core/errors/AppError';
import type { CardDetails } from '../entities/Card';
import type { CardRepository } from '../repositories/CardRepository';

export type GetCardBySlugUseCase = (slug: string, signal?: AbortSignal) => Promise<CardDetails>;

export function createGetCardBySlugUseCase(repository: CardRepository): GetCardBySlugUseCase {
  return (slug, signal) => {
    const trimmedSlug = slug.trim();

    // sanity check for empty slug
    if (!trimmedSlug) {
      return Promise.reject(
        new AppError('notFound', 'We could not find what you were looking for.'),
      );
    }

    return repository.getCardBySlug(trimmedSlug, signal);
  };
}
