/**
 * Status codes shared between server actions and client components so that
 * every transport error can be surfaced accurately instead of being masked
 * as a generic timeout.
 */
export const FetchStatus = {
  OK: 200,
  INVALID: 400,
  NOT_FOUND: 404,
  TIMEOUT: 408,
  SERVER_ERROR: 502,
} as const;

export type FetchStatus = (typeof FetchStatus)[keyof typeof FetchStatus];
