# Token Refresh Implementation

This document explains how the automatic token refresh mechanism works in the application.

## Overview

The token refresh system automatically refreshes the access token every 5 minutes using the refresh token stored in sessionStorage. This ensures users remain authenticated without manual intervention.

## Files Created

1. **`src/utils/tokenRefresh.ts`** - Core token refresh logic
2. **`src/utils/useTokenRefresh.ts`** - React hook for easy integration
3. **`src/utils/tokenRefreshExamples.ts`** - Usage examples

## How It Works

### 1. Token Storage
- **Access Token**: Stored in `localStorage.getItem("accessToken")`
- **Refresh Token**: Stored in `sessionStorage.getItem("refreshToken")`

### 2. Automatic Refresh
- Refreshes every **5 minutes** (300,000 ms)
- Starts automatically when the app loads (if user is authenticated)
- Stops when user logs out

### 3. API Endpoint
```
POST https://meta.oxyloans.com/api/user-service/refresh-token
Content-Type: application/json

{
  "refreshToken": "string"
}
```

### 4. Response Handling
When the API returns new tokens:
- New `accessToken` is saved to `localStorage`
- New `refreshToken` is saved to `sessionStorage`

### 5. Error Handling
If token refresh fails:
- Tokens are cleared from storage
- User is redirected to `/whatsapplogin`
- Current path is saved for redirect after login

## Integration

### Already Integrated in App.tsx

The token refresh is already integrated in your main `App.tsx` file:

```typescript
import { useTokenRefresh } from "./utils/useTokenRefresh";

const App: React.FC = () => {
  // ✅ This automatically starts token refresh
  useTokenRefresh();
  
  // ... rest of your app
};
```

## Usage Examples

### 1. After Login
```typescript
// After successful login
localStorage.setItem("accessToken", response.accessToken);
sessionStorage.setItem("refreshToken", response.refreshToken);

// Token refresh will start automatically via the useTokenRefresh hook
```

### 2. Manual Refresh
```typescript
import { refreshAccessToken } from "./utils/tokenRefresh";

// Manually refresh token
const success = await refreshAccessToken();
if (success) {
  console.log("Token refreshed successfully");
}
```

### 3. Check Authentication
```typescript
import { isAuthenticated } from "./utils/tokenRefresh";

if (isAuthenticated()) {
  // User has valid tokens
} else {
  // Redirect to login
}
```

### 4. Stop Token Refresh (Logout)
```typescript
import { stopTokenRefresh } from "./utils/tokenRefresh";

const handleLogout = () => {
  stopTokenRefresh();
  localStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
  window.location.href = "/whatsapplogin";
};
```

### 5. Protected API Calls
```typescript
import { makeProtectedApiCall } from "./utils/tokenRefreshExamples";

// Automatically retries on 401 errors
const response = await makeProtectedApiCall(
  "https://meta.oxyloans.com/api/user-service/some-endpoint",
  { method: "GET" }
);
```

## API Integration

### Making API Calls with Token

```typescript
const accessToken = localStorage.getItem("accessToken");

const response = await fetch("YOUR_API_URL", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${accessToken}`,
  },
  body: JSON.stringify(data),
});
```

### Handling 401 Errors

```typescript
if (response.status === 401) {
  // Token expired, refresh it
  const success = await refreshAccessToken();
  
  if (success) {
    // Retry the API call with new token
  }
}
```

## Configuration

### Change Refresh Interval

To change the refresh interval, edit `src/utils/tokenRefresh.ts`:

```typescript
// Current: 5 minutes (300000 ms)
refreshTokenInterval = setInterval(() => {
  refreshAccessToken();
}, 5 * 60 * 1000); // Change this value

// Examples:
// 3 minutes: 3 * 60 * 1000
// 10 minutes: 10 * 60 * 1000
// 1 hour: 60 * 60 * 1000
```

### Change API Endpoint

Edit the API URL in `src/utils/tokenRefresh.ts`:

```typescript
const response = await fetch(`${BASE_URL}/user-service/refresh-token`, {
  // ... your endpoint
});
```

## Testing

### Test Token Refresh
1. Login to the application
2. Open browser DevTools → Console
3. You should see: `"Starting automatic token refresh (every 5 minutes)"`
4. Wait 5 minutes or manually call `refreshAccessToken()`
5. Check console for: `"Access token refreshed successfully"`

### Test Token Expiry
1. Manually remove `accessToken` from localStorage
2. Make an API call
3. Token refresh should trigger automatically
4. If refresh fails, you'll be redirected to login

## Troubleshooting

### Token Refresh Not Starting
- Check if `refreshToken` exists in sessionStorage
- Verify `useTokenRefresh()` is called in App.tsx
- Check browser console for errors

### Refresh API Failing
- Verify the API endpoint is correct
- Check if refresh token is valid
- Ensure request body format matches API requirements

### User Redirected to Login Unexpectedly
- Check if refresh token has expired
- Verify API is returning new tokens correctly
- Check browser console for error messages

## Security Notes

1. **Refresh Token Storage**: Stored in `sessionStorage` (cleared when browser closes)
2. **Access Token Storage**: Stored in `localStorage` (persists across sessions)
3. **Automatic Cleanup**: Tokens are cleared on logout or refresh failure
4. **HTTPS Required**: Always use HTTPS in production for token security

## Benefits

✅ **Seamless UX**: Users stay logged in without interruption
✅ **Automatic**: No manual intervention needed
✅ **Secure**: Tokens refresh before expiry
✅ **Error Handling**: Graceful fallback to login on failure
✅ **Easy Integration**: Single hook in App.tsx

## Next Steps

1. ✅ Token refresh is already integrated in App.tsx
2. Test the implementation in your development environment
3. Update your login flow to store refresh token in sessionStorage
4. Add token refresh to your API error handling
5. Test with expired tokens to verify automatic refresh

## Support

For issues or questions, check:
- Browser console for error messages
- Network tab for API calls
- sessionStorage/localStorage for token values
