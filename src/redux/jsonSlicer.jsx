import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: {},
};

const jsonSlicer = createSlice({
  name: 'jsonStore',
  initialState,
  reducers: {
    // Store or replace full JSON under the key
    storeJson: (state, action) => {
      const { key, json } = action.payload;
      state.data[key] = json;
    },

    // Update existing JSON at the key by merging (shallow)
    updateJson: (state, action) => {
      const { key, updates } = action.payload;
      if (state.data[key]) {
        state.data[key] = {
          ...state.data[key],
          ...updates,  // merge new fields or override existing ones
        };
      }
    },

    // Remove a specific key
    clearJson: (state, action) => {
      const key = action.payload;
      delete state.data[key];
    },

    // Clear all JSONs
    clearAllJson: (state) => {
      state.data = {};
    },
  },
});

export const { storeJson, updateJson, clearJson, clearAllJson } = jsonSlicer.actions;
export default jsonSlicer.reducer;
