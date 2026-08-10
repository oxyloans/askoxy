// authCookie.ts
// -----------------------------------------------------------------------------
// Generic cookie utility.
// SAVE: pass a cookie name + id -> it stores { id, savedAt } automatically.
// GET:  pass only the cookie name -> it returns { id, savedAt, retrievedAt }.
// Note: cookies set from JavaScript can never be HttpOnly, so this is just as
// readable by any script on the page as localStorage would be.
// -----------------------------------------------------------------------------

export interface CookieData {
  id: string;
  savedAt: number; // epoch ms when it was saved
}

export interface CookieReadResult extends CookieData {
  retrievedAt: number; // epoch ms when it was read
}

const DEFAULT_EXPIRY_DAYS = 1;

// ---- low-level cookie helpers ----------------------------------------------

function setRawCookie(name: string, value: string, days: number = DEFAULT_EXPIRY_DAYS): void {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax${secure}`;
}

function getRawCookie(name: string): string | null {
  const safeName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = document.cookie.match(new RegExp(`(?:^|; )${safeName}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function clearRawCookie(name: string): void {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax${secure}`;
}

// ---- public API -------------------------------------------------------------

/**
 * Save a value under `name`. You only pass the id — savedAt is captured
 * automatically at the moment this runs.
 */
export function saveCookie(name: string, id: string, days: number = DEFAULT_EXPIRY_DAYS): void {
  const payload: CookieData = {
    id,
    savedAt: Date.now(),
  };
  setRawCookie(name, JSON.stringify(payload), days);
}

/**
 * Read a value back by `name` only. Returns the id, the time it was saved,
 * and the time it was just retrieved (now) — or null if it isn't set.
 */
export function getCookie(name: string): CookieReadResult | null {
  const raw = getRawCookie(name);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as CookieData;

    if (!parsed || typeof parsed.id !== 'string' || !parsed.id.trim()) {
      return null;
    }

    return {
      ...parsed,
      retrievedAt: Date.now(),
    };
  } catch {
    return null;
  }
}

/**
 * Remove a cookie by name.
 */
export function clearCookie(name: string): void {
  clearRawCookie(name);
}
