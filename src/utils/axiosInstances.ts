/**
 * axiosInstances.ts
 *
 * One factory, four module-scoped instances:
 *
 *  customerApi   – Customer portal  (token: Redux store → localStorage "accessToken")
 *  adminApi      – Admin portal      (token: localStorage "admin_acToken")
 *  partnerApi    – Partner/Seller    (token: localStorage "partner_accesstoken")
 *  employeeApi   – Task-management   (token: sessionStorage "accessToken")
 *
 * Every instance shares:
 *  • Content-Type: application/json
 *  • X-Client-Version / X-Client-Platform headers
 *  • X-Request-ID per request (tracing)
 *  • Automatic Bearer token injection
 *  • 401 → token-refresh → one silent retry  (customer only; others redirect to login)
 */

import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { store } from "../store";
import { refreshAccessToken } from "./tokenRefresh";

// ─── Constants ───────────────────────────────────────────────────────────────

const APP_VERSION = process.env.REACT_APP_VERSION || "1.0.0";

const BASE_HEADERS = {
  "Content-Type": "application/json",
  "X-Client-Version": APP_VERSION,
  "X-Client-Platform": "web",
};

// Login routes per module — used for 401 redirects
const LOGIN_ROUTES = {
  admin: "/admin",
  partner: "/partnerlogin",
  employee: "/userlogin",
} as const;

// ─── Token resolvers ─────────────────────────────────────────────────────────

type TokenResolver = () => string | null;

const customerToken: TokenResolver = () =>
  store.getState().auth.accessToken || localStorage.getItem("accessToken");

const adminToken: TokenResolver = () =>
  localStorage.getItem("admin_acToken");

const partnerToken: TokenResolver = () =>
  localStorage.getItem("partner_accesstoken");

const employeeToken: TokenResolver = () =>
  sessionStorage.getItem("accessToken");

// ─── Factory ─────────────────────────────────────────────────────────────────

interface InstanceOptions {
  /** Resolves the Bearer token for this module */
  getToken: TokenResolver;
  /**
   * What to do on an unrecoverable 401.
   * "refresh" → attempt token refresh then retry (customer flow).
   * "redirect" → clear storage and send user to login page.
   */
  on401: "refresh" | "redirect";
  /** Login page path used when on401 === "redirect" */
  loginRoute?: string;
}

function createInstance({
  getToken,
  on401,
  loginRoute,
}: InstanceOptions): AxiosInstance {
  const instance = axios.create({ headers: BASE_HEADERS });

  // ── Request: attach token + trace ID ──────────────────────────────────────
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      if (config.headers) {
        config.headers["X-Request-ID"] = crypto.randomUUID();
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  // ── Response: handle 401 ───────────────────────────────────────────────────
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const original = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      if (error.response?.status !== 401 || original._retry) {
        return Promise.reject(error);
      }

      original._retry = true;

      if (on401 === "refresh") {
        // Customer flow: try to silently refresh, then replay the request
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          const newToken = getToken();
          if (newToken && original.headers) {
            original.headers.Authorization = `Bearer ${newToken}`;
          }
          return instance(original);
        }
      }

      // Redirect flow (or refresh failed): send to the module's login page
      if (loginRoute) {
        const currentPath = window.location.pathname + window.location.search;
        sessionStorage.setItem("redirectPath", currentPath);
        window.location.href = loginRoute;
      }

      return Promise.reject(error);
    }
  );

  return instance;
}
      
// ─── Shared token resolver (admin + partner dual-login safe) ─────────────────

/**
 * Picks the right token based on the active URL:
 *  /admn/*  → admin_acToken
 *  /home/*  → partner_accesstoken
 *  fallback → whichever is present
 */
export const resolvePortalToken = (): string | null => {
  const path = window.location.pathname;
  if (path.startsWith("/admn")) return localStorage.getItem("admin_acToken");
  if (path.startsWith("/home")) return localStorage.getItem("partner_accesstoken");
  return localStorage.getItem("admin_acToken") || localStorage.getItem("partner_accesstoken");
};

const resolvePortalLoginRoute = (): string => {
  const path = window.location.pathname;
  if (path.startsWith("/home")) return LOGIN_ROUTES.partner;
  return LOGIN_ROUTES.admin;
};

/**
 * Shared portal API — for pages mounted under both /admn/* and /home/*.
 * Built directly (not via createInstance) so there is exactly ONE
 * request interceptor and ONE response interceptor with no conflicts.
 */
export const sharedApi = axios.create({ headers: BASE_HEADERS });

sharedApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = resolvePortalToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.headers) {
      config.headers["X-Request-ID"] = crypto.randomUUID();
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

sharedApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const currentPath = window.location.pathname + window.location.search;
      sessionStorage.setItem("redirectPath", currentPath);
      window.location.href = resolvePortalLoginRoute();
    }
    return Promise.reject(error);
  }
);

// ─── Module instances ─────────────────────────────────────────────────────────

/** Customer portal — supports silent token refresh via Redux */
export const customerApi = createInstance({
  getToken: customerToken,
  on401: "refresh",
  loginRoute: "/whatsapplogin",
});

/** Admin portal — redirects to /admin on 401 */
export const adminApi = createInstance({
  getToken: adminToken,
  on401: "redirect",
  loginRoute: LOGIN_ROUTES.admin,
});

/** Partner / Seller portal — redirects to /partnerlogin on 401 */
export const partnerApi = createInstance({
  getToken: partnerToken,
  on401: "redirect",
  loginRoute: LOGIN_ROUTES.partner,
});

/** Employee / Task-management portal — redirects to /userlogin on 401 */
export const employeeApi = createInstance({
  getToken: employeeToken,
  on401: "redirect",
  loginRoute: LOGIN_ROUTES.employee,
});

// ─── Default export (backwards-compatible) ───────────────────────────────────
// Existing code that imports axiosInstance from this file keeps working.
export default customerApi;
