import Config from 'react-native-config';
import { z } from 'zod';

const EnvSchema = z.object({
  apiBaseUrl: z.url(),
  rapidApiHost: z.string().min(1),
  rapidApiKey: z.string().min(1),
  requestTimeoutMs: z.number().int().positive(),
});

/**
 * Validated at startup so a missing key fails fast here, not as a
 * confusing 401 later. Values come from `.env` via react-native-config,
 * which bakes them in at build time — edit `.env`, then rebuild.
 */
export const env = EnvSchema.parse({
  apiBaseUrl: Config.RAPIDAPI_BASE_URL,
  rapidApiHost: Config.RAPIDAPI_HOST,
  rapidApiKey: Config.RAPIDAPI_KEY,
  requestTimeoutMs: Number(Config.REQUEST_TIMEOUT_MS ?? 10_000),
});
