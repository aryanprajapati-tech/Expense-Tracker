//import {  Logout, Token } from "@mui/icons-material";
import { createSlice } from "@reduxjs/toolkit";
const initialState={
    token:localStorage.getItem("token") || null,
    isLoggedIn:!!localStorage.getItem("token"),
    user:null,
};
const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        loginSuccess:(state,action)=>{
            state.token=action.payload.accessToken;
            state.user=action.payload.user;
            state.isLoggedIn=true;
            localStorage.setItem("token",action.payload.accessToken);
        },
        logout:(state)=>{
            state.token=null;
            state.user=null;
            state.isLoggedIn=false;
            localStorage.removeItem("token");
        },
    },
});
export const{ loginSuccess,logout }=authSlice.actions;
export default authSlice.reducer;