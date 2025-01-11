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
import AuthorInfo from "./components/AuthorInfo";

import Courses from "./components/GPT/Courses";
import Accomidation from "./components/GPT/Accomidation";
import UniversityAgents from "./components/GPT/UniversityAgents";
import ScrollToTop from "./components/ScrollToTop";
import FileUpload from "./Pages/FileUpload";
import Sidebar from "./Pages/Sider";
import CampaignsAdd from "./Pages/CampaignsAdd";
import AllCampaignsDetails from "./Pages/AllCampaignDetail";
import Placements from "./components/GPT/Placements";
import ForeignExchange from "./components/GPT/ForeignExchange";
import University from "./components/GPT/University";
import Assistants from "./components/GPT/Assistants";
import AuthorizeandAgencies from "./components/GPT/Authorize&Agencies";
import QualificationSpecializationGPT from "./components/GPT/QualificationSpecializationGPT";
import Reviews from "./components/GPT/Reviews";
import InformationAboutCountries from "./components/GPT/InformationAboutCountries";
import Loans from "./components/GPT/Lonsgpt";
import Scholarship from "./components/GPT/Scholarships";
import Logistics from "./components/GPT/Logistics";
import Visa from "./components/GPT/Visa";
import AccreditationsRecognization from "./components/GPT/AccreditationsRecognization";
import ApplicationSupport from "./components/GPT/AppliocationSupport";
import AcceptanceLetter from "./components/GPT/AcceptanceLetter";
import AllQueries from "./Pages/AllQueries";
const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <Routes>
          <Route path="/reviews-gpt" element={<Reviews />} />
          <Route
            path="/informationaboutcountries-gpt"
            element={<InformationAboutCountries />}
          />
          <Route path="/" element={<Landingpage />} />
          <Route path="/erice" element={<Erice />} />
          <Route path="/sider" element={<Sidebar />} />
          <Route path="/fileupload" element={<FileUpload />} />
          <Route
            path="/allcampaignsdetails"
            element={<AllCampaignsDetails />}
          />
          <Route path="/campaignsadd" element={<CampaignsAdd />} />{" "}
          <Route path="/universities-gpt" element={<University />} />
          <Route
            path="/universitiesagents-gpt"
            element={<AuthorizeandAgencies />}
          />
          <Route
            path="/qualificationspecialization-gpt"
            element={<QualificationSpecializationGPT />}
          />
          <Route path="/testandinterview-gpt" element={<Assistants />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/alluserqueries" element={<AllQueriesforAdmin />} />
          <Route path="/university-agents" element={<UniversityAgents />} />
          {/* <Route path="/AuthorInfo" element={<AuthorInfo />} />
          <Route path="/rudraksha-vanabhojanam" element={<Flow />} /> */}
          {/* <Route path="/rudraksha" element={<RudrakshaSteps />} /> */}
          <Route path="/freerudraksha" Component={Freerudraksha} />
          <Route path="/userqueries" Component={AllQueries} />
          <Route path="/freesample&steelcontainer" element={<FreeSample />} />
          <Route path="/freeaiandgenai" element={<FreeAiandGenAi />} />
          <Route path="/studyabroad" element={<StudyAbroad />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dasboard />} />
          <Route path="/normal" element={<Normal />} />
          <Route path="/meeting" element={<Meeting />} />
          <Route path="/legalservice" element={<LegalService />} />
          <Route path="/myrotary" element={<MyRotaryServices />} />
          <Route path="/courses-gpt" element={<Courses />} />
          <Route path="/loans-gpt" element={<Loans />} />
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
          <Route path="/accommodation-gpt" element={<Accomidation />} />
          <Route path="/logistics-gpt" element={<Logistics />} />
          <Route
            path="/applicationsupport-gpt"
            element={<ApplicationSupport />}
          />
          <Route path="/acceptanceletter-gpt" element={<AcceptanceLetter />} />
          <Route path="/visa-gpt" element={<Visa />} />
          <Route
            path="/accreditations-gpt"
            element={<AccreditationsRecognization />}
          />
         
          <Route path="placements-gpt" element={<Placements />} />
          <Route path="scholarships-gpt" element={<Scholarship />} />
          <Route path="/foreign-exchange" element={<ForeignExchange />} />
          <Route path="/happy-diwali" element={<Happy_Diwali />} />
          <Route path="/example" element={<Example variant="loading01" />} />
          <Route path="/greenproject" element={<Greenproject />} />
          <Route path="/el-dorado" element={<EL_Dorado />} />
          <Route path="/whatapplogin" element={<Whatapplogin />} />
          {/* <Route path="/example-component" element={<ExampleComponent />} /> */}
          <Route path="/user-profile" element={<UserProfileModel />} />
          {/* <Route path="/30NoV24Vanabhojanam" element={<PresentationViewer />} /> */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
