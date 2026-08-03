import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import transactionReducer from "./transactionSlice";
import summaryReducer from "./summarySlice";

export const store=configureStore({
    reducer:{
        auth:authReducer,
        transaction:transactionReducer,
        summary:summaryReducer,

    },
})