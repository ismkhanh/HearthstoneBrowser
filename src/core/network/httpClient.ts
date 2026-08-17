import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';

import { env } from '../config/env';
import { AppError } from '../errors/AppError';
import { toAppError } from './toAppError';

/**
 * This is a thin wrapper around axios.
 * data sources ask for a `HttpClient`, not for axios. 
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

// make sure the response is not an error payload.
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
