import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Erice from "./components/Erice";
import Landingpage from "./components/Landingpage";
import Dasboard from "./components/Dashboard";
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
import VanabhojanamSteps from "./components/VanabhojanamaSteps";
import RudrakshaSteps from "./components/RudrakshaSteps";
import FreeSample from "./components/FreeSample";
import FreeAiandGenAi from "./components/FreeAi&GenAi";
import StudyAbroad from "./components/StudyAbroad";
import Flow from "./components/Flow";
import MachinesManufacturingServices from "./components/Machines&ManufacturingService";
import LegalService from "./components/LegalService";
import MyRotaryServices from "./components/MyRotary";
import AllQueriesforAdmin from "./components/UserQueries";
import Admin from "./Pages/Admin";
const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Landingpage />} />
          <Route path="/erice" element={<Erice />} />
          <Route path="/admin" element={<Admin />} /> 
          <Route path="/alluserqueries" element={<AllQueriesforAdmin />} />   
          {/* <Route path="/vanabhojanam" element={<VanabhojanamSteps />} />
          <Route path="/rudraksha-vanabhojanam" element={<Flow />} /> */}
          {/* <Route path="/rudraksha" element={<RudrakshaSteps />} /> */}
          <Route path="/freerudraksha" Component={Freerudraksha} />
          <Route path="/freesample&steelcontainer" element={<FreeSample />} />
          <Route path="/freeaiandgenai" element={<FreeAiandGenAi />} />
          <Route path="/studyabroad" element={<StudyAbroad />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dasboard />} />
          <Route path="/normal" element={<Normal />} />
          <Route path="/meeting" element={<Meeting />} />
          <Route path="/legalservice" element={<LegalService />} />
          <Route path="/myrotary" element={<MyRotaryServices />} />
          <Route
            path="/machines&manufacturing"
            element={<MachinesManufacturingServices />}
          />
          {/* <Route path="/vanabhojanam" element={<Vanabhojanam/>}/> */}

          {/* Redirect to add a trailing slash if missing */}
          <Route
            path="/freerudraksha"
            element={<Navigate to="/freerudraksha/" />}
          />
          <Route
            path="/StudyAbroad"
            element={<Navigate to="/StudyAbroad/" />}
          />

          {/* <Route path="/freerudraksha/" element={<Freerudraksha />} /> */}

          <Route path="/happy-diwali" element={<Happy_Diwali />} />
          <Route path="/example" element={<Example variant="loading01" />} />
          <Route path="/greenproject" element={<Greenproject />} />
          <Route path="/el-dorado" element={<EL_Dorado />} />
          <Route path="/whatapplogin" element={<Whatapplogin />} />
          {/* <Route path="/example-component" element={<ExampleComponent />} /> */}
          <Route path="/user-profile-model" element={<UserProfileModel />} />
          {/* <Route path="/30NoV24Vanabhojanam" element={<PresentationViewer />} /> */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
