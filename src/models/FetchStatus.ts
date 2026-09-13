/**
 * Status codes shared between server actions and client components so that
 * every transport error can be surfaced accurately instead of being masked
 * as a generic timeout.
 */
export const FetchStatus = {
  INVALID: 400,
  NOT_FOUND: 404,
  OK: 200,
  SERVER_ERROR: 502,
  TIMEOUT: 408,
} as const;

export type FetchStatus = (typeof FetchStatus)[keyof typeof FetchStatus];
