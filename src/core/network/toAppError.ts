import axios from 'axios';
import { ZodError } from 'zod';

import { AppError } from '../errors/AppError';

// map error to AppError
export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof ZodError) {
    return new AppError('validation', 'The server returned an unexpected response.');
  }

  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') {
      return new AppError('timeout', 'The request took too long. Please try again.');
    }

    const status = error.response?.status;
    if (status === undefined) {
      return new AppError('network', 'No internet connection. Please try again.');
    }
    if (status === 401 || status === 403) {
      return new AppError('unauthorized', 'Your API key was rejected.', status);
    }
    if (status === 404) {
      return new AppError('notFound', 'We could not find what you were looking for.', status);
    }
    if (status >= 500) {
      return new AppError('server', 'The service is unavailable right now.', status);
    }
    return new AppError('unknown', 'Something went wrong.', status);
  }

  return new AppError('unknown', 'Something went wrong.');
}
