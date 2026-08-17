import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';

import { env } from '../config/env';
import { AppError } from '../errors/AppError';
import { toAppError } from './toAppError';

/**
 * Minimal contract the data layer depends on (Dependency Inversion): data
 * sources ask for a `HttpClient`, not for axios. That keeps them trivial to
 * fake in unit tests and makes swapping the transport a one-file change.
 */
export interface HttpClient {
  get<TResponse>(
    path: string,
    options?: { params?: Record<string, unknown>; signal?: AbortSignal },
  ): Promise<TResponse>;
}

export function createHttpClient(): HttpClient {
  const instance = createAxiosInstance();

  return {
    async get(path, options) {
      const config: AxiosRequestConfig = {
        params: options?.params,
        signal: options?.signal,
      };

      try {
        const response = await instance.get(path, config);
        return unwrap(response.data);
      } catch (error) {
        throw toAppError(error);
      }
    },
  };
}

/**
 * This API reports some misses as HTTP 200 with `{ ok: false, message }` in
 * the body instead of a 404, so the envelope is checked before the payload
 * reaches any caller.
 */
function unwrap<TResponse>(body: TResponse): TResponse {
  if (body && typeof body === 'object' && (body as { ok?: unknown }).ok === false) {
    const { message } = body as { message?: string };
    throw new AppError('notFound', message || 'We could not find what you were looking for.', 404);
  }
  return body;
}

function createAxiosInstance(): AxiosInstance {
  return axios.create({
    baseURL: env.apiBaseUrl,
    timeout: env.requestTimeoutMs,
    headers: {
      'Content-Type': 'application/json',
      'x-rapidapi-host': env.rapidApiHost,
      'x-rapidapi-key': env.rapidApiKey,
    },
  });
}
