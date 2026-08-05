import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCategorySummary = createAsyncThunk(
  "categorySummary/fetchCategorySummary",
  async ({ fromDate, toDate }) => {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      "http://localhost:8080/category-summary",
      {
        fromDate,
        toDate,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  }
);

const categorySummarySlice = createSlice({
  name: "categorySummary",
  initialState: {
    categorySummary: [],
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchCategorySummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategorySummary.fulfilled, (state, action) => {
        state.loading = false;
        state.categorySummary = action.payload;
      })
      .addCase(fetchCategorySummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default categorySummarySlice.reducer;