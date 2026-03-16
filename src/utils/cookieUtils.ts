const REFRESH_TOKEN_KEY = "rt";
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

export const getRefreshToken = (): string | null =>
  cookieUtils.get(REFRESH_TOKEN_KEY);

export const setRefreshToken = (token: string): void =>
  cookieUtils.set(REFRESH_TOKEN_KEY, token);

export const removeRefreshToken = (): void =>
  cookieUtils.remove(REFRESH_TOKEN_KEY);
