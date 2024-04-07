import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    isPreparing: false,
    isNewUser: true,
    isFarmer: true,
  },
  reducers: {
    setPreparing(state, action) {
      state.isPreparing = action.payload;
    },
    setAsNewUser(state, action) {
      state.isNewUser = action.payload;
      console.log("isNewUser", state.isNewUser);
    },
    setFarmer(state, action) {
      state.isFarmer = action.payload;
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice;
