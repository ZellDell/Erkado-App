import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: {
      userInfoId: null,
      userId: null,
      fullname: null,
      address: null,
      coordinates: null,
      userType: null,
      profileImg: null,
      extraInfo: null,
      purchasingDetails: null,
    },
  },
  reducers: {
    setUserInfo(state, action) {
      state.userInfo = action.payload;
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice;
