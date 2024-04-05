import { createSlice } from "@reduxjs/toolkit";

const cropSlice = createSlice({
  name: "user",
  initialState: {
    crops: {
      CropID: null,
      Quality: null,
      Type: null,
      CropName: null,
      Description: null,
      Uri: null,
    },
  },
  reducers: {
    setCrops(state, action) {
      state.crops = action.payload;
    },
  },
});

export const cropActions = cropSlice.actions;

export default cropSlice;
