import { routing } from "@/i18n/routing";

type Locale = (typeof routing.locales)[number];

/**
 * Persists the selected locale in a cookie so next-intl can pick it up
 * on the next request. Validates the value against the routing locale list
 * before writing, preventing arbitrary strings from reaching document.cookie.
 */
export function setLocaleCookie(locale: string): void {
  if (!(routing.locales as readonly string[]).includes(locale)) {
    console.warn(`setLocaleCookie: unknown locale "${locale}" — ignoring`);
    return;
  }

  const maxAge = 30 * 24 * 60 * 60; // 30 days
  const sanitized = encodeURIComponent(locale as Locale);

  const cookieParts = [
    `NEXT_LOCALE=${sanitized}`,
    `max-age=${maxAge}`,
    "path=/",
    "SameSite=Lax",
  ];

  if (
    typeof window !== "undefined" &&
    window.location.protocol === "https:" &&
    process.env.NODE_ENV === "production"
  ) {
    cookieParts.push("Secure");
  }

  document.cookie = cookieParts.join(";");
}
