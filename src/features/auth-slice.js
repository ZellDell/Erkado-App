import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    authenticated: false,
  },
  reducers: {
    setAuthState(state, action) {
      state.token = action.payload.token;
      state.authenticated = action.payload.authenticated;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice;
