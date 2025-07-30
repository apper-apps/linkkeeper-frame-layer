import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  suggestions: null,
  isGenerating: false,
  isApplying: false,
  error: null,
  lastGenerated: null,
  appliedCount: 0
};

export const bundlingSlice = createSlice({
  name: 'bundling',
  initialState,
  reducers: {
    startGenerating: (state) => {
      state.isGenerating = true;
      state.error = null;
    },
    setSuggestions: (state, action) => {
      state.suggestions = action.payload;
      state.isGenerating = false;
      state.lastGenerated = new Date().toISOString();
      state.error = null;
    },
    startApplying: (state) => {
      state.isApplying = true;
      state.error = null;
    },
    applyComplete: (state, action) => {
      state.isApplying = false;
      state.appliedCount = action.payload.updated || 0;
      state.suggestions = null; // Clear suggestions after applying
      state.error = null;
    },
    setBundlingError: (state, action) => {
      state.error = action.payload;
      state.isGenerating = false;
      state.isApplying = false;
    },
    clearSuggestions: (state) => {
      state.suggestions = null;
      state.error = null;
    }
  }
});

export const { 
  startGenerating, 
  setSuggestions, 
  startApplying, 
  applyComplete, 
  setBundlingError, 
  clearSuggestions 
} = bundlingSlice.actions;

export default bundlingSlice.reducer;