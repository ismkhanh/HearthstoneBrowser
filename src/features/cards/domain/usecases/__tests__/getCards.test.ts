import { buildCardsPage } from '../../../../../test/fixtures/cardFixtures';
import type { CardRepository } from '../../repositories/CardRepository';
import { DEFAULT_PAGE_SIZE, createGetCardsUseCase } from '../getCards';

function createRepositoryStub(): jest.Mocked<CardRepository> {
  return {
    getCards: jest.fn().mockResolvedValue(buildCardsPage()),
    getCardBySlug: jest.fn(),
  };
}

describe('getCards use case', () => {
  it('applies the default page and page size', async () => {
    const repository = createRepositoryStub();

    await createGetCardsUseCase(repository)({});

    expect(repository.getCards).toHaveBeenCalledWith(
      { page: 1, pageSize: DEFAULT_PAGE_SIZE, search: undefined },
      undefined,
    );
  });

  it('never requests a page below one', async () => {
    const repository = createRepositoryStub();

    await createGetCardsUseCase(repository)({ page: 0 });

    expect(repository.getCards).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1 }),
      undefined,
    );
  });

  it('trims the search term and omits it when shorter than the minimum', async () => {
    const repository = createRepositoryStub();
    const getCards = createGetCardsUseCase(repository);

    await getCards({ search: '  fire  ' });
    await getCards({ search: 'f' });
    await getCards({ search: '   ' });

    expect(repository.getCards).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ search: 'fire' }),
      undefined,
    );
    expect(repository.getCards).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ search: undefined }),
      undefined,
    );
    expect(repository.getCards).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({ search: undefined }),
      undefined,
    );
  });

  it('forwards the abort signal', async () => {
    const repository = createRepositoryStub();
    const signal = new AbortController().signal;

    await createGetCardsUseCase(repository)({ page: 2 }, signal);

    expect(repository.getCards).toHaveBeenCalledWith(expect.anything(), signal);
  });
});
