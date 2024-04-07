import { createSlice } from "@reduxjs/toolkit";

const traderSlice = createSlice({
  name: "user",
  initialState: {
    Transactions: {
      TraderID: null,
      UserID: null,
      Fullname: null,
      Address: null,
      coordinates: null,
      TraderType: null,
      profileImg: null,
    },
    Messages: {
      TraderID: null,
      UserID: null,
      Fullname: null,
      Address: null,
      coordinates: null,
      TraderType: null,
      profileImg: null,
    },
  },
  reducers: {
    setTransactions(state, action) {
      state.Transactions = action.payload;
    },
    setMessages(state, action) {
      state.Messages = action.payload;
    },
  },
});

export const traderActions = userSlice.actions;

export default traderSlice;
