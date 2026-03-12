import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  userId: string | null;
  accessToken: string | null;
  whatsappNumber: string | null;
  mobileNumber: string | null;
  profileData: any | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  userId: localStorage.getItem('userId'),
  accessToken: localStorage.getItem('accessToken'),
  whatsappNumber: localStorage.getItem('whatsappNumber'),
  mobileNumber: localStorage.getItem('mobileNumber'),
  profileData: localStorage.getItem('profileData') 
    ? JSON.parse(localStorage.getItem('profileData')!) 
    : null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        userId: string;
        accessToken: string;
        whatsappNumber?: string;
        mobileNumber?: string;
        profileData?: any;
      }>
    ) => {
      state.userId = action.payload.userId;
      state.accessToken = action.payload.accessToken;
      state.whatsappNumber = action.payload.whatsappNumber || null;
      state.mobileNumber = action.payload.mobileNumber || null;
      state.profileData = action.payload.profileData || null;
      state.isAuthenticated = true;

      localStorage.setItem('userId', action.payload.userId);
      localStorage.setItem('accessToken', action.payload.accessToken);
      if (action.payload.whatsappNumber) {
        localStorage.setItem('whatsappNumber', action.payload.whatsappNumber);
      }
      if (action.payload.mobileNumber) {
        localStorage.setItem('mobileNumber', action.payload.mobileNumber);
      }
      if (action.payload.profileData) {
        localStorage.setItem('profileData', JSON.stringify(action.payload.profileData));
      }
    },
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      localStorage.setItem('accessToken', action.payload);
    },
    updateProfileData: (state, action: PayloadAction<any>) => {
      state.profileData = action.payload;
      localStorage.setItem('profileData', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.userId = null;
      state.accessToken = null;
      state.whatsappNumber = null;
      state.mobileNumber = null;
      state.profileData = null;
      state.isAuthenticated = false;

      localStorage.removeItem('userId');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('whatsappNumber');
      localStorage.removeItem('mobileNumber');
      localStorage.removeItem('profileData');
    },
  },
});

export const { setCredentials, updateAccessToken, updateProfileData, logout } = authSlice.actions;
export default authSlice.reducer;
