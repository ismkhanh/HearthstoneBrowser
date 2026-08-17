/**
 * Transport-agnostic error used by every layer above the network client.
 * Nothing outside `core/network` knows that axios exists.
 */
export type AppErrorKind =
  | 'network'
  | 'timeout'
  | 'unauthorized'
  | 'notFound'
  | 'server'
  | 'validation'
  | 'unknown';

export class AppError extends Error {
  readonly kind: AppErrorKind;
  readonly status?: number;

  constructor(kind: AppErrorKind, message: string, status?: number) {
    super(message);
    this.name = 'AppError';
    this.kind = kind;
    this.status = status;
  }

  /** Retrying a client error (404/401) will never succeed. */
  get isRetryable(): boolean {
    return this.kind === 'network' || this.kind === 'timeout' || this.kind === 'server';
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
