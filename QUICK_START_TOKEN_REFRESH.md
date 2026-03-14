# Token Refresh Integration - Quick Start Guide

## ✅ What Has Been Implemented

### 1. Core Files Created
- **`src/utils/tokenRefresh.ts`** - Main token refresh logic
- **`src/utils/useTokenRefresh.ts`** - React hook for automatic refresh
- **`src/utils/tokenRefreshExamples.ts`** - Usage examples
- **`TOKEN_REFRESH_README.md`** - Complete documentation

### 2. Integration Points
- ✅ **App.tsx** - Token refresh hook integrated
- ✅ **axiosInstance.ts** - Axios interceptor with auto-retry on 401

## 🚀 How It Works

### Automatic Refresh (Every 5 Minutes)
```
User Logs In
    ↓
Tokens Stored (localStorage + sessionStorage)
    ↓
useTokenRefresh() Hook Starts
    ↓
Every 5 Minutes: Call /api/user-service/refresh-token
    ↓
Update Tokens in Storage
    ↓
Continue...
```

### On API 401 Error
```
API Call Returns 401
    ↓
Axios Interceptor Catches Error
    ↓
Call refreshAccessToken()
    ↓
Retry Original Request with New Token
    ↓
Success or Redirect to Login
```

## 📝 Required Changes in Your Code

### 1. Update Login Flow
After successful login, store the refresh token:

```typescript
// In your login success handler
const handleLoginSuccess = (response) => {
  // Store access token
  localStorage.setItem("accessToken", response.accessToken);
  
  // ✅ ADD THIS: Store refresh token
  sessionStorage.setItem("refreshToken", response.refreshToken);
  
  // Store other user data
  localStorage.setItem("userId", response.userId);
  localStorage.setItem("customerId", response.customerId);
  
  // Token refresh will start automatically
};
```

### 2. Update Logout Flow
Stop token refresh on logout:

```typescript
import { stopTokenRefresh } from "./utils/tokenRefresh";

const handleLogout = () => {
  // Stop token refresh
  stopTokenRefresh();
  
  // Clear tokens
  localStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
  
  // Redirect to login
  window.location.href = "/whatsapplogin";
};
```

### 3. API Calls (Optional Enhancement)
Use the enhanced axios instance for automatic retry:

```typescript
import axiosInstance from "./utils/axiosInstance";

// This will automatically retry on 401 errors
const response = await axiosInstance.get("/api/user-service/some-endpoint");
```

## 🔧 Configuration

### Change Refresh Interval
Edit `src/utils/tokenRefresh.ts` line 67:

```typescript
// Current: 5 minutes
refreshTokenInterval = setInterval(() => {
  refreshAccessToken();
}, 5 * 60 * 1000); // Change this value
```

### Change API Endpoint
Edit `src/utils/tokenRefresh.ts` line 24:

```typescript
const response = await fetch(`${BASE_URL}/user-service/refresh-token`, {
  // Your endpoint here
});
```

## 🧪 Testing

### 1. Test Automatic Refresh
```bash
# 1. Login to your app
# 2. Open DevTools Console
# 3. You should see:
"Starting automatic token refresh (every 5 minutes)"

# 4. Wait 5 minutes or manually trigger:
import { refreshAccessToken } from "./utils/tokenRefresh";
await refreshAccessToken();

# 5. Check console:
"Access token refreshed successfully"
```

### 2. Test 401 Error Handling
```bash
# 1. Make an API call
# 2. Manually expire the access token (change it in localStorage)
# 3. Make another API call
# 4. Should see automatic token refresh and retry
```

### 3. Test Token Expiry
```bash
# 1. Remove refresh token from sessionStorage
sessionStorage.removeItem("refreshToken");

# 2. Wait for next refresh cycle (5 minutes)
# 3. Should redirect to login page
```

## 📋 Checklist

- [x] Token refresh utility created
- [x] React hook created
- [x] Integrated in App.tsx
- [x] Axios interceptor updated
- [x] Documentation created
- [ ] Update login flow to store refreshToken
- [ ] Update logout flow to stop token refresh
- [ ] Test in development environment
- [ ] Test with expired tokens
- [ ] Deploy to production

## 🎯 Key Features

✅ **Automatic Refresh**: Every 5 minutes
✅ **Seamless UX**: No user interruption
✅ **Error Handling**: Auto-retry on 401
✅ **Security**: Tokens cleared on failure
✅ **Easy Integration**: Single hook in App.tsx

## 📞 API Details

### Endpoint
```
POST https://meta.oxyloans.com/api/user-service/refresh-token
```

### Request
```json
{
  "refreshToken": "string"
}
```

### Response (Expected)
```json
{
  "accessToken": "new_access_token",
  "refreshToken": "new_refresh_token"
}
```

## 🐛 Troubleshooting

### Token Refresh Not Working
1. Check if `refreshToken` exists in sessionStorage
2. Verify API endpoint is correct
3. Check browser console for errors
4. Ensure `useTokenRefresh()` is called in App.tsx

### User Redirected to Login
1. Check if refresh token is valid
2. Verify API is returning new tokens
3. Check network tab for API response

### Axios Interceptor Not Working
1. Ensure you're using `axiosInstance` from `utils/axiosInstance.ts`
2. Check if token is in localStorage
3. Verify Authorization header is being added

## 📚 Additional Resources

- **Full Documentation**: `TOKEN_REFRESH_README.md`
- **Usage Examples**: `src/utils/tokenRefreshExamples.ts`
- **Core Logic**: `src/utils/tokenRefresh.ts`

## 🎉 You're All Set!

The token refresh mechanism is now integrated and will work automatically. Just make sure to:
1. Store `refreshToken` in sessionStorage after login
2. Test the implementation
3. Deploy to production

Happy coding! 🚀
