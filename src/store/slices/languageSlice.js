import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentLanguage: "en", // Default language is English
  isRTL: false, // Default direction is LTR
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.currentLanguage = action.payload;
      state.isRTL = action.payload === "ar"; // Set RTL for Arabic language
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
