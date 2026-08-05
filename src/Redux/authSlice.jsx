// //import {  Logout, Token } from "@mui/icons-material";
// import { createSlice } from "@reduxjs/toolkit";
// const initialState={
//     token:localStorage.getItem("token") || null,
//     isLoggedIn:!!localStorage.getItem("token"),
//     user:null,
// };
// const authSlice=createSlice({
//     name:"auth",
//     initialState,
//     reducers:{
//         loginSuccess:(state,action)=>{
//             state.token=action.payload.accessToken;
//             state.user=action.payload.user;
//             state.isLoggedIn=true;
//             localStorage.setItem("token",action.payload.accessToken);
//         },
//         logout:(state)=>{
//             state.token=null;
//             state.user=null;
//             state.isLoggedIn=false;
//             localStorage.removeItem("token");
//         },
//     },
// });
// export const{ loginSuccess,logout }=authSlice.actions;
// export default authSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (formData) => {
    const response = await fetch("http://localhost:8080/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    return await response.json();
  }
);

const initialState = {
  token: localStorage.getItem("token") || null,
  isLoggedIn: !!localStorage.getItem("token"),
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isLoggedIn = false;

      localStorage.removeItem("token");
    },
  },

  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.token = action.payload.accessToken;
      state.user = action.payload.user;
      state.isLoggedIn = true;

      localStorage.setItem("token", action.payload.accessToken);
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;