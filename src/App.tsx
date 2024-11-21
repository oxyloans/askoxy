import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Erice from "./components/Erice";
import Landingpage from "./components/Landingpage";
import Normal from "./components/Normal";
import Example from "./components/Example";
import UserProfileModel from "./components/models/ProfileCallPage";
import Whatapplogin from "./components/Whatapplogin";
import Meeting from "./components/Meeting";
import Happy_Diwali from "./components/Happy_Diwali";
import Greenproject from "./components/Greenproject";
import EL_Dorado from "./components/EL_Dorado";
import Freerudraksha from "./components/Freerudraksh";
import Login from "./components/login";
import ExampleComponent from "./components/Examplecomponet";
import Vanabhojanam from "./components/Vanabhojanam";
import PresentationViewer from "./components/PresentationViewer";
import FlowSteps from "./components/FlowSteps";



const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Landingpage />} />
          <Route path="/erice" element={<Erice />} />
          <Route path='/rudraksha-vanabhojanam' element={<FlowSteps/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/normal" element={<Normal />} />
          <Route path="/meeting" element={<Meeting />} />
          <Route path="/vanabhojanam" element={<Vanabhojanam/>}/>

          {/* Redirect to add a trailing slash if missing */}
          <Route
            path="/freerudraksha"
            element={<Navigate to="/freerudraksha/" />}
          />
          <Route path="/freerudraksha/" element={<Freerudraksha />} />

          {/* <Route path="/happy-diwali" element={<Happy_Diwali />} /> */}
          <Route path="/example" element={<Example variant="loading01" />} />
          <Route path="/greenproject" element={<Greenproject />} />
          <Route path="/el-dorado" element={<EL_Dorado />} />
          <Route path="/whatapplogin" element={<Whatapplogin />} />
          <Route path="/example-component" element={<ExampleComponent />} />
          <Route path="/user-profile-model" element={<UserProfileModel />} />
          <Route path="/30NoV24Vanabhojanam"  element={<PresentationViewer/>}/>
          
        </Routes>
      </div>
    </Router>
  );
};

export default App;
