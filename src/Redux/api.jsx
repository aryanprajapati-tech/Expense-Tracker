import { LocalActivity } from "@mui/icons-material";
import axios from "axios";
const api =axios.create({
    baseURL:"http://localhost:8080",
});
api.interceptors.request.use((config)=>{
    const token=localStorage.getItem("token");
    if(token){
        config.headers.Authorization=`Bearer ${token}`;
    }
    return config;
});
// // Logout automatically when token is invalid or expired
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("token");
//       localStorage.removeItem("loginTime");

//       // Notify React to logout
//       window.dispatchEvent(new Event("logout"));
//     }

//     return Promise.reject(error);
//   }
// );
export default api;