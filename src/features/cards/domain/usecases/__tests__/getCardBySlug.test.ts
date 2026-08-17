import { AppError } from '../../../../../core/errors/AppError';
import type { CardRepository } from '../../repositories/CardRepository';
import { createGetCardBySlugUseCase } from '../getCardBySlug';

describe('getCardBySlug use case', () => {
  function createRepositoryStub(): jest.Mocked<CardRepository> {
    return {
      getCards: jest.fn(),
      getCardBySlug: jest.fn().mockResolvedValue({ slug: 'fireball' }),
    };
  }

  it('delegates to the repository', async () => {
    const repository = createRepositoryStub();
    const signal = new AbortController().signal;

    await createGetCardBySlugUseCase(repository)('fireball', signal);

    expect(repository.getCardBySlug).toHaveBeenCalledWith('fireball', signal);
  });

  it('rejects an empty slug without calling the repository', async () => {
    const repository = createRepositoryStub();

    await expect(createGetCardBySlugUseCase(repository)('  ')).rejects.toBeInstanceOf(AppError);
    expect(repository.getCardBySlug).not.toHaveBeenCalled();
  });
});
