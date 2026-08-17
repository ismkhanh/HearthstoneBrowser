import type { HttpClient } from '../../../../../core/network/httpClient';
import { buildCardDto, buildCardsResponseDto } from '../../../../../test/fixtures/cardFixtures';
import { createCardRemoteDataSource } from '../CardRemoteDataSource';

describe('CardRemoteDataSource', () => {
  const http: jest.Mocked<HttpClient> = { get: jest.fn() };

  beforeEach(() => jest.clearAllMocks());

  it('omits the search param when there is no search query', async () => {
    http.get.mockResolvedValue(buildCardsResponseDto());

    await createCardRemoteDataSource(http).fetchCards({ page: 1, pageSize: 20 });

    expect(http.get).toHaveBeenCalledWith('/cards', {
      params: { page: 1, pageSize: 20 },
      signal: undefined,
    });
  });

  it('sends the search query to the server when present', async () => {
    http.get.mockResolvedValue(buildCardsResponseDto());

    await createCardRemoteDataSource(http).fetchCards({ page: 2, pageSize: 20, search: 'fire' });

    expect(http.get).toHaveBeenCalledWith('/cards', {
      params: { page: 2, pageSize: 20, search: 'fire' },
      signal: undefined,
    });
  });

  it('encodes the slug in the detail path', async () => {
    http.get.mockResolvedValue(buildCardDto());

    await createCardRemoteDataSource(http).fetchCardBySlug('a light');

    expect(http.get).toHaveBeenCalledWith('/cards/a%20light', { signal: undefined });
  });
});
