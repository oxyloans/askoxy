# Detailed Bug Analysis: Automatic `/whatsapplogin` Redirects & 401 Token Refresh Issues

## Executive Summary

There are two major symptoms causing unexpected redirects to `/whatsapplogin`:
1. **Opening `http://localhost:3000/` (`/`) automatically redirects to `/whatsapplogin`**:
   Users trying to view the public landing page are abruptly kicked to `/whatsapplogin` instead of seeing the home page.
2. **After logging in, navigating or staying on `/` sometimes kicks the user right back to `/whatsapplogin`**:
   Users log in, are redirected to `/`, but shortly after are logged out and redirected to `/whatsapplogin` again. Only after logging in a second time does it work.
3. **Any 401 API response or failed refresh token across the entire project forcibly redirects to `/whatsapplogin`**, even when the user is on a public page or an unauthenticated route.

---

## Root Causes Identified

### 1. `src/utils/tokenRefresh.ts`: Unconditional `window.location.href = "/whatsapplogin"` on Refresh Failure
- **Location:** `src/utils/tokenRefresh.ts` (Lines 64–70)
- **Code:**
  ```typescript
  } catch {
    store.dispatch(logout());
    const currentPath = window.location.pathname + window.location.search;
    sessionStorage.setItem("redirectPath", currentPath);
    window.location.href = "/whatsapplogin";
    return false;
  }
  ```
- **How it triggers the bug:**
  - In `src/App.tsx` (Line 895), `useTokenRefresh()` runs on **every single route load**, including the root path `/` (`localhost:3000`).
  - If a user has a previously stored token in `localStorage` or `rt` cookie that has expired:
    1. `useTokenRefresh()` triggers `startTokenRefresh()`, which immediately calls `refreshAccessToken()`.
    2. `refreshAccessToken()` sends a `POST` request to `/user-service/refresh-token`.
    3. Because the refresh token is expired or invalid on the backend, the API returns `401 Unauthorized` or throws an error.
    4. The `catch` block catches the error and **forcibly executes `window.location.href = "/whatsapplogin"`**!
    5. The user, who simply visited `http://localhost:3000/` to read the landing page, is abruptly navigated away to `/whatsapplogin`.
    6. Furthermore, `currentPath` (`"/"`) is saved into `sessionStorage.redirectPath`, causing post-login redirect issues.

---

### 2. `src/utils/axiosInstances.ts`: Blind 401 Redirection on Public Pages
- **Location:** `src/utils/axiosInstances.ts` (Lines 207–215)
- **Code:**
  ```typescript
  // Redirect flow (or refresh failed): clear the module's tokens then send to login
  if (clearTokens) clearTokens();
  if (loginRoute) {
    const currentPath = window.location.pathname + window.location.search;
    sessionStorage.setItem("redirectPath", currentPath);
    window.location.href = loginRoute; // loginRoute is "/whatsapplogin"
  }
  ```
- **How it triggers the bug:**
  - `axiosInstance` is exported as `customerApi` by default in `src/utils/axiosInstance.ts`.
  - Public pages and components (e.g. `ServicesSlider` on the landing page `/` calling `fetchCampaigns()` in `src/components/servicesapi.ts`) use `axiosInstance`.
  - When `customerApi` makes a request:
    1. The request interceptor attaches `Authorization: Bearer <token>` from `localStorage` or `c_at` cookie.
    2. If that token is expired or invalid, the backend API responds with `401 Unauthorized`.
    3. The response interceptor attempts `refreshAccessToken()`.
    4. When `refreshAccessToken()` fails (or if no refresh token exists), `axiosInstances.ts` **unconditionally forces** `window.location.href = loginRoute` (`/whatsapplogin`).
  - **Crucial flaw:** It does not check if the user is currently on a public route (`/`, `/freeaibook`, `/oxynews`, `/studyabroad`, etc.) vs a protected route (`/main/*`). Any 401 on any public page forcibly kicks the user to `/whatsapplogin`!

---

### 3. `src/Pages/Auth/WhatsappLogin.tsx` & `WhatsappRegister.tsx`: Token Field Mismatch (`refreshToken` vs `mobileOtpSession`)
- **Location:** `src/Pages/Auth/WhatsappLogin.tsx` (Lines 658–661) & `WhatsappRegister.tsx` (Lines 741–744)
- **Code:**
  ```typescript
  if (response.data.refreshToken) {
    setRefreshToken(response.data.refreshToken);
    store.dispatch(updateRefreshToken(response.data.refreshToken));
  }
  ```
- **How it triggers the bug:**
  - The backend auth service returns tokens using mobile OTP session keys:
    - Access token: `data.accessToken` or `data.mobileNumber`
    - Refresh token: `data.refreshToken` or `data.mobileOtpSession`
    *(Note: This is explicitly documented in `src/utils/tokenRefresh.ts` line 188: "This endpoint currently returns the new access/refresh JWTs under mobileNumber/mobileOtpSession")*.
  - When the user logs in:
    1. If the API returns the refresh token inside `data.mobileOtpSession` instead of `data.refreshToken`, `response.data.refreshToken` is `undefined`.
    2. `setRefreshToken()` is **NOT** called. The cookie `rt` is never updated with the new refresh token (it stays empty or holds the old, expired token).
    3. The user gets redirected to `/`.
    4. On `/`, `useTokenRefresh()` immediately attempts to refresh using the old/missing `rt` cookie.
    5. The refresh API fails with 401, triggers the catch block, logs the user out, and **immediately redirects back to `/whatsapplogin`**!
    6. This explains why users experience: *"sometime after login automatic /whatsapplogin, then after logging in again it works"*.

---

### 4. `src/utils/tokenRefresh.ts`: Refresh API Response Extraction & Cookie Sync
- **Location:** `src/utils/tokenRefresh.ts` (Lines 53–62)
- **Code:**
  ```typescript
  const data = await response.json();

  if (data.mobileNumber) {
    store.dispatch(updateAccessToken(data.mobileNumber));
  }

  if (data.mobileOtpSession) {
    store.dispatch(updateRefreshToken(data.mobileOtpSession));
  }
  ```
- **How it triggers the bug:**
  - It only checks `data.mobileNumber` (missing `data.accessToken || data.mobileNumber`).
  - It only checks `data.mobileOtpSession` (missing `data.refreshToken || data.mobileOtpSession`).
  - It does not update the customer access cookie (`setCustomerAccessToken`).
  - If the backend returns standard field names (`accessToken`), the refreshed token is discarded, the next API request sends the expired token, gets 401, and redirects to login.

---

### 5. `sessionStorage.redirectPath` Polluted with `"/"`
- **Location:** `src/utils/tokenRefresh.ts` (Line 67) & `src/utils/axiosInstances.ts` (Line 211)
- When a 401 happens on `"/"`, both files execute:
  ```typescript
  sessionStorage.setItem("redirectPath", currentPath); // Saves "/"
  ```
- When the user logs in on `/whatsapplogin`:
  `WhatsappLogin.tsx` reads `sessionStorage.getItem("redirectPath")` (which is `"/"`), and navigates back to `"/"`.
- If an unhandled 401 occurs again on `"/"`, the loop repeats.
- Auth pages and public landing routes (`"/"`, `"/whatsapplogin"`, `"/whatsappregister"`) should **never** be saved as a `redirectPath`.

---

## Exact Proposed Fix Plan (Zero Changes to Existing Flow)

All existing successful login flows, dashboard redirects, role checks, and protected routes will remain 100% intact. We only fix the erroneous redirection and token storage bugs:

### Fix 1: Stop redirecting from public pages in `src/utils/tokenRefresh.ts`
1. Remove `window.location.href = "/whatsapplogin"` from the `catch` block of `refreshAccessToken()`.
2. When refresh fails:
   - Call `store.dispatch(logout())` to cleanly reset auth state in Redux and cookies.
   - Do NOT redirect. The user stays on whatever page they were browsing.
   - Only if the user is on a protected route (e.g. `window.location.pathname.startsWith("/main")`) should redirection be handled, or better, let the route guard (`RequireAuth`) or caller handle it.

### Fix 2: Protect public pages from 401 redirects in `src/utils/axiosInstances.ts`
1. In the 401 response interceptor for `customerApi`:
   - If token refresh fails:
     - Clear tokens (`clearTokens()`).
     - Check if the current route is a **protected route** (e.g. `window.location.pathname.startsWith("/main")`).
     - If it is a protected route: save `redirectPath` (excluding auth pages and `"/"`) and redirect to `loginRoute`.
     - If it is a **public route** (`"/"`, `"/oxynews"`, `"/freeaibook"`, `"/studyabroad"`, etc.): **DO NOT REDIRECT**. The user remains on the public page as an unauthenticated guest.

### Fix 3: Handle both token field formats in `WhatsappLogin.tsx` & `WhatsappRegister.tsx`
1. When saving tokens on login/registration:
   ```typescript
   const newAccessToken = response.data.accessToken || response.data.mobileNumber;
   const newRefreshToken = response.data.refreshToken || response.data.mobileOtpSession;

   if (newRefreshToken) {
     setRefreshToken(newRefreshToken);
     store.dispatch(updateRefreshToken(newRefreshToken));
   }
   ```
   This guarantees the refresh token cookie (`rt`) is always updated, preventing immediate token expiration upon landing on `/`.

### Fix 4: Support both field formats and cookie sync in `refreshAccessToken()` (`tokenRefresh.ts`)
1. Extract both standard and mobile OTP field names:
   ```typescript
   const newAccessToken = data.accessToken || data.mobileNumber;
   const newRefreshToken = data.refreshToken || data.mobileOtpSession;

   if (newAccessToken) {
     setCustomerAccessToken(newAccessToken);
     store.dispatch(updateAccessToken(newAccessToken));
   }
   if (newRefreshToken) {
     setRefreshToken(newRefreshToken);
     store.dispatch(updateRefreshToken(newRefreshToken));
   }
   ```

### Fix 5: Prevent `"/"` and auth routes from being saved into `sessionStorage.redirectPath`
1. Ensure `redirectPath` is only saved when the target is a valid protected page (`path !== "/" && !path.includes("whatsapplogin") && !path.includes("whatsappregister")`).
