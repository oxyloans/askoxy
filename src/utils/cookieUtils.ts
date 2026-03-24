const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

export const cookieUtils = {
  set(name: string, value: string, maxAge = COOKIE_MAX_AGE): void {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Strict${secure}`;
  },

  get(name: string): string | null {
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`));
    return match ? decodeURIComponent(match.split("=")[1]) : null;
  },

  remove(name: string): void {
    document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Strict`;
  },
};

// ─── Cookie keys ─────────────────────────────────────────────────────────────

export const COOKIE_KEYS = {
  // Customer
  customerAccess:  "c_at",
  customerRefresh: "rt",
  // Admin
  adminAccess:     "a_at",
  adminRefresh:    "a_rt",
  // Partner
  partnerAccess:   "p_at",
  partnerRefresh:  "p_rt",
  // Employee
  employeeAccess:  "e_at",
  employeeRefresh: "e_rt",
} as const;

// ─── Customer ─────────────────────────────────────────────────────────────────
export const getRefreshToken = (): string | null =>
  cookieUtils.get(COOKIE_KEYS.customerRefresh);
export const setRefreshToken = (token: string): void =>
  cookieUtils.set(COOKIE_KEYS.customerRefresh, token);
export const removeRefreshToken = (): void =>
  cookieUtils.remove(COOKIE_KEYS.customerRefresh);

export const getCustomerAccessToken = (): string | null =>
  cookieUtils.get(COOKIE_KEYS.customerAccess);
export const setCustomerAccessToken = (token: string): void =>
  cookieUtils.set(COOKIE_KEYS.customerAccess, token);
export const removeCustomerAccessToken = (): void =>
  cookieUtils.remove(COOKIE_KEYS.customerAccess);

// ─── Admin ────────────────────────────────────────────────────────────────────
export const getAdminAccessToken = (): string | null =>
  cookieUtils.get(COOKIE_KEYS.adminAccess);
export const setAdminAccessToken = (token: string): void =>
  cookieUtils.set(COOKIE_KEYS.adminAccess, token);
export const removeAdminAccessToken = (): void =>
  cookieUtils.remove(COOKIE_KEYS.adminAccess);

export const getAdminRefreshToken = (): string | null =>
  cookieUtils.get(COOKIE_KEYS.adminRefresh);
export const setAdminRefreshToken = (token: string): void =>
  cookieUtils.set(COOKIE_KEYS.adminRefresh, token);
export const removeAdminRefreshToken = (): void =>
  cookieUtils.remove(COOKIE_KEYS.adminRefresh);

// ─── Partner ──────────────────────────────────────────────────────────────────
export const getPartnerAccessToken = (): string | null =>
  cookieUtils.get(COOKIE_KEYS.partnerAccess);
export const setPartnerAccessToken = (token: string): void =>
  cookieUtils.set(COOKIE_KEYS.partnerAccess, token);
export const removePartnerAccessToken = (): void =>
  cookieUtils.remove(COOKIE_KEYS.partnerAccess);

export const getPartnerRefreshToken = (): string | null =>
  cookieUtils.get(COOKIE_KEYS.partnerRefresh);
export const setPartnerRefreshToken = (token: string): void =>
  cookieUtils.set(COOKIE_KEYS.partnerRefresh, token);
export const removePartnerRefreshToken = (): void =>
  cookieUtils.remove(COOKIE_KEYS.partnerRefresh);

// ─── Employee ─────────────────────────────────────────────────────────────────
export const getEmployeeAccessToken = (): string | null =>
  cookieUtils.get(COOKIE_KEYS.employeeAccess);
export const setEmployeeAccessToken = (token: string): void =>
  cookieUtils.set(COOKIE_KEYS.employeeAccess, token);
export const removeEmployeeAccessToken = (): void =>
  cookieUtils.remove(COOKIE_KEYS.employeeAccess);

export const getEmployeeRefreshToken = (): string | null =>
  cookieUtils.get(COOKIE_KEYS.employeeRefresh);
export const setEmployeeRefreshToken = (token: string): void =>
  cookieUtils.set(COOKIE_KEYS.employeeRefresh, token);
export const removeEmployeeRefreshToken = (): void =>
  cookieUtils.remove(COOKIE_KEYS.employeeRefresh);
