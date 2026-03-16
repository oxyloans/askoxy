import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setRefreshToken, removeRefreshToken, getRefreshToken } from "../utils/cookieUtils";

interface AuthState {
  userId: string | null;
  accessToken: string | null;
  whatsappNumber: string | null;
  mobileNumber: string | null;
  profileData: Record<string, unknown> | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  userId: localStorage.getItem("userId"),
  accessToken: localStorage.getItem("accessToken"),
  whatsappNumber: localStorage.getItem("whatsappNumber"),
  mobileNumber: localStorage.getItem("mobileNumber"),
  profileData: (() => {
    try {
      const raw = localStorage.getItem("profileData");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })(),
  isAuthenticated: !!(localStorage.getItem("accessToken") && getRefreshToken()),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        userId: string;
        accessToken: string;
        refreshToken: string;
        whatsappNumber?: string;
        mobileNumber?: string;
        profileData?: Record<string, unknown>;
      }>
    ) => {
      const { userId, accessToken, refreshToken, whatsappNumber, mobileNumber, profileData } =
        action.payload;

      state.userId = userId;
      state.accessToken = accessToken;
      state.whatsappNumber = whatsappNumber ?? null;
      state.mobileNumber = mobileNumber ?? null;
      state.profileData = profileData ?? null;
      state.isAuthenticated = true;

      localStorage.setItem("userId", userId);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("token", accessToken);
      if (whatsappNumber) localStorage.setItem("whatsappNumber", whatsappNumber);
      if (mobileNumber) localStorage.setItem("mobileNumber", mobileNumber);
      if (profileData) localStorage.setItem("profileData", JSON.stringify(profileData));

      // Refresh token stored in a cookie (Secure + SameSite=Strict)
      setRefreshToken(refreshToken);
    },

    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      localStorage.setItem("accessToken", action.payload);
      localStorage.setItem("token", action.payload);
    },

    updateRefreshToken: (_state, action: PayloadAction<string>) => {
      setRefreshToken(action.payload);
    },

    updateProfileData: (state, action: PayloadAction<Record<string, unknown>>) => {
      state.profileData = action.payload;
      localStorage.setItem("profileData", JSON.stringify(action.payload));
    },

    logout: (state) => {
      state.userId = null;
      state.accessToken = null;
      state.whatsappNumber = null;
      state.mobileNumber = null;
      state.profileData = null;
      state.isAuthenticated = false;

      localStorage.removeItem("userId");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("token");
      localStorage.removeItem("whatsappNumber");
      localStorage.removeItem("mobileNumber");
      localStorage.removeItem("profileData");

      removeRefreshToken();
    },
  },
});

export const {
  setCredentials,
  updateAccessToken,
  updateRefreshToken,
  updateProfileData,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
