import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./api";

const initialState = {
  transactions: [],
  totalPages: 1,
  loading: false,
  error: null,
};

export const fetchTransactions = createAsyncThunk(
  "transaction/fetchTransactions",
  async ({ page, size }) => {
    const response = await api.get(`/transaction?page=${page}&size=${size}`);
    return response.data;
  }
);

export const createTransactions = createAsyncThunk(
  "transaction/createTransactions",
  async (transaction) => {
    const response = await api.post(`/addTransaction`, transaction);
    return response.data;
  }
);

export const updateTransactions = createAsyncThunk(
  "transaction/updateTransactions",
  async ({ id, transaction }) => {
    const response = await api.put(`/transaction/${id}`, transaction);
    return response.data;
  }
);

export const deleteTransactions = createAsyncThunk(
  "transaction/deleteTransactions",
  async (id) => {
    await api.delete(`/transaction/${id}`);
    return id;
  }
);

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.content;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = "unable to load";
      })
    .addCase(createTransactions.fulfilled, (state, action) => {
  state.transactions.unshift(action.payload);
})
      .addCase(updateTransactions.fulfilled, (state, action) => {
        const index = state.transactions.findIndex(
          (t) => t.id === action.payload.id
        );
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      })
      .addCase(deleteTransactions.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter(
          (t) => t.id !== action.payload
        );
      });
  },
});

export default transactionSlice.reducer;
