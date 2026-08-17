import Config from 'react-native-config';
import { z } from 'zod';

const EnvSchema = z.object({
  apiBaseUrl: z.url(),
  rapidApiHost: z.string().min(1),
  rapidApiKey: z.string().min(1),
  requestTimeoutMs: z.number().int().positive(),
});

/**
 * Check at startup so a required missing key fails early here
 */
export const env = EnvSchema.parse({
  apiBaseUrl: Config.RAPIDAPI_BASE_URL,
  rapidApiHost: Config.RAPIDAPI_HOST,
  rapidApiKey: Config.RAPIDAPI_KEY,
  requestTimeoutMs: Number(Config.REQUEST_TIMEOUT_MS ?? 10_000),
});
