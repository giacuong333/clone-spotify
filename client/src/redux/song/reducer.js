import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { initialState } from "./initialState";
import { apiInstance } from "../../contexts/Axios";
import { apis } from "../../constants/apis";

export const searchItems = createAsyncThunk(
  "search/searchItems",
  async ({ query, category }, { rejectWithValue }) => {
    try {
      if (!searchItems.trim()) return { data: [] };
      return await apiInstance.get(apis.songs.search(), {
        params: { q: query, category },
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const songSlice = createSlice({
  name: "song",
  initialState,
  reducers: {
    createSong: (state, action) => {
      console.log("Do create functionality here");
    },
    updateSong: (state, action) => {
      console.log("Do update functionality here");
    },
    deleteSong: (state, action) => {
      console.log("Do delete functionality here");
    },
    clearSearch: (state) => {
      state.results = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(searchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Action creators are generated for each case reducer function
export const { clearSearch, createSong, updateSong, deleteSong } =
  songSlice.actions;

export default songSlice.reducer;
