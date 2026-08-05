
import {  Routes, Route } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
 import Dashboard from "./Dashboard";

function App() {
  return (
  
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} /> 
          <Route path="/dashboard" element={<Dashboard />} />
         
      </Routes>
   
  );
}

export default App;