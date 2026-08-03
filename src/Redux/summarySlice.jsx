import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import api from "./api";

const initialState={
    totalIncome:0,
    totalExpense:0,
    balance:0,
    loading:false,
};
export const fetchSummary=createAsyncThunk(
    "summary/fetchSummary",
    async()=>{
        const response=await api.get(
            "/transaction/summary"
        );
        return response.data;
    }
);
const summarySlice=createSlice({
    name:"summary",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(fetchSummary.pending,(state)=>{
            state.loading=true;
        })
        .addCase(fetchSummary.fulfilled,(state,action)=> {
            state.loading=false,
            state.totalIncome=action.payload.totalIncome;
             state.totalExpense=action.payload.totalExpense;
             state.balance=action.payload.balance;
            
        })
        .addCase(fetchSummary.rejected,(state)=>{
            state.loading=false;
        });
    },

});
export default summarySlice.reducer;