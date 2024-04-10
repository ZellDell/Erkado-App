import { createSlice } from "@reduxjs/toolkit";

const cropSlice = createSlice({
  name: "user",
  initialState: {
    crops: {
      CropID: null,
      CropName: null,
      Description: null,
      Uri: null,
    },
    quality: {
      QualityTypeID: null,
      QualityType: null,
    },
  },
  reducers: {
    setCrops(state, action) {
      state.crops = action.payload;
    },
    setQuality(state, action) {
      state.quality = action.payload;
    },
  },
});

export const cropActions = cropSlice.actions;

export default cropSlice;
