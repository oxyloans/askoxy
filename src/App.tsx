import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Erice from "./components/Erice";
import Landingpage from "./components/Landingpage";
import Login from "./components/login";
import Normal from "./components/Normal";
import Example from "./components/Example";
import Examplecomponet from "./components/Examplecomponet";
import UserProfileModel from "./components/models/ProfileCallPage";
import ProfileCallPage from "./components/models/ProfileCallPage";
import Whatapplogin from "./components/Whatapplogin";
import Meeting from "./components/Meeting";
// import Happy from "./components/DiwaliPage";
import Happy_Diwali from "./components/Happy_Diwali";
import Greenproject from "./components/Greenproject";
import EL_Dorado from "./components/EL_Dorado";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Landingpage />} />
          <Route path="/erice" element={<Erice />} />
          <Route path="/login" element={<Login />} />
          <Route path="/normal" element={<Normal />} />
          <Route path="/meeting" element={<Meeting />} />
          <Route path="/Happy_Diwali" element={<Happy_Diwali/>} /> 
          <Route path="/Example" element={<Example variant="loading01" />} />         
           <Route path="/Greenproject" element={<Greenproject/>} /> 
           <Route path="/EL_Dorado" element={<EL_Dorado/>} /> 
          <Route path="/whatapplogin" element={<Whatapplogin />} />
          <Route path="/Examplecomponet" element={<Examplecomponet />} />{" "}
          <Route path="/UserProfileModel" element={<ProfileCallPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
