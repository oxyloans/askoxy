// employeeAuthCookie.ts

const COOKIE_MAX_AGE_DAYS = 7;

export interface EmployeeAuthPayload {
  id: string;
  primaryType: string | null;
  companyName?: string | null;
}

const REQUIRED_PRIMARY_TYPE = "JOBS";

/** Low-level: write a cookie. Value is JSON-stringified. */
export const saveCookie = (name: string, value: unknown): void => {
  try {
    const serialized = encodeURIComponent(JSON.stringify(value));
    const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
    document.cookie = `${name}=${serialized}; path=/; max-age=${maxAge}; SameSite=Lax`;
  } catch {
    // Swallow — a failed cookie write shouldn't crash the UI.
  }
};

/** Low-level: read a cookie and JSON-parse it. Returns null if missing/corrupt. */
export const getCookie = <T = unknown>(name: string): T | null => {
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));

  if (!match) return null;

  const raw = match.substring(name.length + 1);

  try {
    return JSON.parse(decodeURIComponent(raw)) as T;
  } catch {
    return null;
  }
};

export const clearCookie = (name: string): void => {
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
};

/**
 * High-level helper: reads the employee auth cookie and validates it.
 * Returns null if the cookie is missing, corrupt, OR primaryType isn't JOBS —
 * so every page can treat "null" as "not authorized for this workspace",
 * without re-implementing the JOBS check on every page.
 */
export const getEmployeeAuth = (): EmployeeAuthPayload | null => {
  const parsed = getCookie<EmployeeAuthPayload | string>("companyContactPersonId");

  if (!parsed) return null;

  // Backward-compat: older sessions may have stored a bare id string.
  // Treat those as invalid so the user is asked to log in again and pick
  // up a session that actually carries primaryType/companyName.
  if (typeof parsed === "string") return null;

  if (!parsed.id || parsed.primaryType !== REQUIRED_PRIMARY_TYPE) {
    return null;
  }

  return parsed;
};

export const saveEmployeeAuth = (payload: EmployeeAuthPayload): void => {
  saveCookie("companyContactPersonId", payload);
};

export const clearEmployeeAuth = (): void => {
  clearCookie("companyContactPersonId");
};
















// // authCookie.ts
// // -----------------------------------------------------------------------------
// // Generic cookie utility.
// // SAVE: pass a cookie name + id -> it stores { id, savedAt } automatically.
// // GET:  pass only the cookie name -> it returns { id, savedAt, retrievedAt }.
// // Note: cookies set from JavaScript can never be HttpOnly, so this is just as
// // readable by any script on the page as localStorage would be.
// // -----------------------------------------------------------------------------

// export interface CookieData {
//   id: string;
//   savedAt: number; // epoch ms when it was saved
// }

// export interface CookieReadResult extends CookieData {
//   retrievedAt: number; // epoch ms when it was read
// }

// const DEFAULT_EXPIRY_DAYS = 1;

// // ---- low-level cookie helpers ----------------------------------------------

// function setRawCookie(name: string, value: string, days: number = DEFAULT_EXPIRY_DAYS): void {
//   const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
//   const secure = window.location.protocol === 'https:' ? '; Secure' : '';
//   document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax${secure}`;
// }

// function getRawCookie(name: string): string | null {
//   const safeName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
//   const match = document.cookie.match(new RegExp(`(?:^|; )${safeName}=([^;]*)`));
//   return match ? decodeURIComponent(match[1]) : null;
// }

// function clearRawCookie(name: string): void {
//   const secure = window.location.protocol === 'https:' ? '; Secure' : '';
//   document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax${secure}`;
// }

// // ---- public API -------------------------------------------------------------

// /**
//  * Save a value under `name`. You only pass the id — savedAt is captured
//  * automatically at the moment this runs.
//  */
// export function saveCookie(name: string, id: string, days: number = DEFAULT_EXPIRY_DAYS): void {
//   const payload: CookieData = {
//     id,
//     savedAt: Date.now(),
//   };
//   setRawCookie(name, JSON.stringify(payload), days);
// }

// /**
//  * Read a value back by `name` only. Returns the id, the time it was saved,
//  * and the time it was just retrieved (now) — or null if it isn't set.
//  */
// export function getCookie(name: string): CookieReadResult | null {
//   const raw = getRawCookie(name);
//   if (!raw) return null;

//   try {
//     const parsed = JSON.parse(raw) as CookieData;

//     if (!parsed || typeof parsed.id !== 'string' || !parsed.id.trim()) {
//       return null;
//     }

//     return {
//       ...parsed,
//       retrievedAt: Date.now(),
//     };
//   } catch {
//     return null;
//   }
// }

// /**
//  * Remove a cookie by name.
//  */
// export function clearCookie(name: string): void {
//   clearRawCookie(name);
// }
