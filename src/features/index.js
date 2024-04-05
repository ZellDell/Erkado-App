import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth-slice";
import uiSlice from "./ui-slice";
import userSlice from "./user-slice";
import cropSlice from "./crop-slice";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    ui: uiSlice.reducer,
    user: userSlice.reducer,
    crop: cropSlice.reducer,
  },
});
