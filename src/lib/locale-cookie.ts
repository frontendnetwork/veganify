const ALLOWED_LOCALES = ["en", "de", "es", "fr", "pl", "cz", "pt-br"] as const;

type Locale = (typeof ALLOWED_LOCALES)[number];

/**
 * Persists the selected locale in a cookie so next-intl can pick it up
 * on the next request. Validates the value against the known locale list
 * before writing, preventing arbitrary strings from reaching document.cookie.
 */
export function setLocaleCookie(locale: string): void {
  if (!(ALLOWED_LOCALES as readonly string[]).includes(locale)) {
    console.warn(`setLocaleCookie: unknown locale "${locale}" — ignoring`);
    return;
  }

  const maxAge = 30 * 24 * 60 * 60; // 30 days
  const sanitized = encodeURIComponent(locale as Locale);
  document.cookie = `NEXT_LOCALE=${sanitized};max-age=${maxAge};path=/;SameSite=Lax`;
}
