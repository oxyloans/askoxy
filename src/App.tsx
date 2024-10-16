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

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Landingpage />} />
          <Route path="/erice" element={<Erice />} />
          <Route path="/login" element={<Login />} />
          <Route path="/normal" element={<Normal />} />
          <Route path="/Example" element={<Example variant="loading01" />} />
          <Route path="/whatapplogin" element={<Whatapplogin />} />
          <Route path="/Examplecomponet" element={<Examplecomponet />} />{" "}
          <Route path="/UserProfileModel" element={<ProfileCallPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
