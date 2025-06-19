import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';

export type AuthState = {
  user: TUser | null;
  isLoggedIn: boolean;
  isAuthChecked: boolean;
};

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
  isAuthChecked: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<TUser>) {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.isAuthChecked = true;
    },
    logout(state) {
      state.user = null;
      state.isLoggedIn = false;
      state.isAuthChecked = true;
    },
    setAuthChecked(state, action: PayloadAction<boolean>) {
      state.isAuthChecked = action.payload;
    }
  }
});

export const { setUser, logout, setAuthChecked } = authSlice.actions;
export const authReducer = authSlice.reducer;
