import { isAppError } from '../../errors/AppError';
import { createHttpClient } from '../httpClient';

const mockGet = jest.fn();

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    create: () => ({ get: (...args: unknown[]) => mockGet(...args) }),
    isAxiosError: () => false,
  },
}));

describe('createHttpClient', () => {
  beforeEach(() => mockGet.mockReset());

  it('returns the response payload', async () => {
    mockGet.mockResolvedValue({ data: { id: 1 } });

    await expect(createHttpClient().get('/cards')).resolves.toEqual({ id: 1 });
  });

  it('turns the HTTP-200 `{ ok: false }` envelope into a notFound error', async () => {
    mockGet.mockResolvedValue({ data: { ok: false, message: 'Card not found.' } });

    const failure = await createHttpClient()
      .get('/cards/bogus-slug')
      .catch((error: unknown) => error);

    expect(isAppError(failure) && failure.kind).toBe('notFound');
    expect(isAppError(failure) && failure.message).toBe('Card not found.');
  });
});
