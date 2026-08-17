import { AxiosError, AxiosHeaders, type AxiosResponse } from 'axios';
import { z } from 'zod';
import { AppError } from '../../errors/AppError';
import { toAppError } from '../toAppError';

function buildAxiosError(status?: number, code?: string): AxiosError {
  const config = { headers: new AxiosHeaders() };
  const response =
    status === undefined
      ? undefined
      : ({ status, data: null, statusText: '', headers: {}, config } as AxiosResponse);

  return new AxiosError('request failed', code, config, null, response);
}

function buildZodError() {
  const result = z.number().safeParse('not-a-number');
  if (result.success) {
    throw new Error('expected the parse to fail');
  }
  return result.error;
}

describe('toAppError', () => {
  it('returns an existing AppError untouched', () => {
    const original = new AppError('server', 'test error msg', 500);

    expect(toAppError(original)).toBe(original);
  });

  it.each([
    [buildAxiosError(undefined), 'network'],
    [buildAxiosError(undefined, 'ECONNABORTED'), 'timeout'],
    [buildAxiosError(401), 'unauthorized'],
    [buildAxiosError(404), 'notFound'],
    [buildAxiosError(503), 'server'],
    [buildAxiosError(418), 'unknown'],
  ])('maps axios failures to the right kind', (error, kind) => {
    expect(toAppError(error).kind).toBe(kind);
  });

  it('treats server errors as retryable and client errors as not', () => {
    expect(toAppError(buildAxiosError(503)).isRetryable).toBe(true);
    expect(toAppError(buildAxiosError(404)).isRetryable).toBe(false);
  });

  it('maps a ZodError to a non-retryable validation error', () => {
    const result = toAppError(buildZodError());

    expect(result.kind).toBe('validation');
    expect(result.isRetryable).toBe(false);
  });

  it('maps unknown throwables', () => {
    expect(toAppError('oops')).toBeInstanceOf(AppError);
    expect(toAppError('oops').kind).toBe('unknown');
  });
});
