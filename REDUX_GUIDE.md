# Redux Implementation Guide

## Overview
This implementation provides Redux state management for user authentication with security measures to prevent inspection.

## Features

### 1. Redux Store
- Centralized state management for user data
- Automatic localStorage synchronization
- TypeScript support with type-safe hooks

### 2. Security Measures
- Disable right-click context menu
- Disable F12 and developer tool shortcuts
- Detect and block DevTools opening
- Hide console logs in production
- Hide network requests in production
- Axios interceptor for automatic token injection

## Installation

Run this command:

```bash
npm install @reduxjs/toolkit react-redux
```

## Usage

### 1. Using Redux Hooks

```typescript
import { useAppDispatch, useAppSelector } from './store/hooks';
import { setCredentials, logout } from './store/authSlice';

function MyComponent() {
  const dispatch = useAppDispatch();
  const { userId, accessToken, isAuthenticated } = useAppSelector((state) => state.auth);

  // Login
  const handleLogin = (userData) => {
    dispatch(setCredentials({
      userId: userData.userId,
      accessToken: userData.accessToken,
      whatsappNumber: userData.whatsappNumber,
      mobileNumber: userData.mobileNumber,
      profileData: userData.profileData
    }));
  };

  // Logout
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, User ID: {userId}</p>
      ) : (
        <p>Please login</p>
      )}
    </div>
  );
}
```

### 2. Using Axios Instance

Replace all axios imports with the custom instance:

```typescript
// Before
import axios from 'axios';

// After
import axiosInstance from './utils/axiosInstance';

// Usage (same as before)
const response = await axiosInstance.get('/api/endpoint');
```

### 3. Accessing Redux State Anywhere

```typescript
import { store } from './store';

// Get current state
const state = store.getState();
const userId = state.auth.userId;
const token = state.auth.accessToken;

// Dispatch actions
import { logout } from './store/authSlice';
store.dispatch(logout());
```

## File Structure

```
src/
├── store/
│   ├── index.ts                    # Store configuration
│   ├── authSlice.ts                # Auth state slice
│   └── hooks.ts                    # Typed Redux hooks
├── utils/
│   ├── security.ts                 # Security measures
│   └── axiosInstance.ts            # Axios with interceptors
└── index.tsx                       # App entry with Redux Provider
```

## Security Features

### Disabled in Production:
- Right-click context menu
- F12 key
- Ctrl+Shift+I (Inspect)
- Ctrl+Shift+J (Console)
- Ctrl+Shift+C (Inspect Element)
- Ctrl+U (View Source)
- Console methods (log, warn, error, etc.)
- Network request visibility

### Active Detection:
- DevTools opening detection
- Automatic page replacement if DevTools detected

## Environment Variables

Add to `.env`:
```
REACT_APP_API_URL=http://localhost:3001
```

## Migration from localStorage

Replace all localStorage calls:

```typescript
// Before
const userId = localStorage.getItem('userId');
const token = localStorage.getItem('accessToken');

// After
import { useAppSelector } from './store/hooks';
const { userId, accessToken } = useAppSelector((state) => state.auth);
```

## Redux State Structure

```typescript
interface AuthState {
  userId: string | null;
  accessToken: string | null;
  whatsappNumber: string | null;
  mobileNumber: string | null;
  profileData: any | null;
  isAuthenticated: boolean;
}
```

## Available Actions

### setCredentials
Store user credentials after login:
```typescript
dispatch(setCredentials({
  userId: 'user123',
  accessToken: 'token...',
  whatsappNumber: '+1234567890',
  mobileNumber: '+1234567890',
  profileData: { name: 'John', email: 'john@example.com' }
}));
```

### updateAccessToken
Update only the access token:
```typescript
dispatch(updateAccessToken('newToken...'));
```

### updateProfileData
Update only the profile data:
```typescript
dispatch(updateProfileData({ name: 'Jane', email: 'jane@example.com' }));
```

### logout
Clear all user data:
```typescript
dispatch(logout());
```

## Troubleshooting

### Security measures too strict
- Comment out specific functions in `security.ts`
- Adjust detection threshold in `detectDevTools()`

### Redux state not persisting
- Check if localStorage is enabled
- Verify browser doesn't block localStorage
- Check Redux DevTools (only in development)

### Axios not injecting token
- Verify Redux store has accessToken
- Check axios interceptor is imported
- Use axiosInstance instead of axios

## Notes

- Security measures only active in production build
- All localStorage operations synced with Redux
- Automatic token injection in all API calls
- No token refresh (no refresh API available)
