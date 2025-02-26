// import React from "react";
// import {
//   BrowserRouter as Router,
//   Route,
//   Routes,
//   Navigate,
// } from "react-router-dom";
// import Erice from "./components/Erice";

// import Landingpage from "./components/Landingpage";
// import Dasboard from "./components/Dashboard";
// import Normal from "./components/Normal";
// import Example from "./components/Example";
// import UserProfileModel from "./components/models/ProfileCallPage";
// import Whatapplogin from "./components/Whatapplogin";
// import Meeting from "./components/Meeting";
// import Happy_Diwali from "./components/Happy_Diwali";
// import Greenproject from "./components/Greenproject";
// import EL_Dorado from "./components/EL_Dorado";
// import Freerudraksha from "./components/Freerudraksh";
// import Login from "./components/login";
// import ExampleComponent from "./components/Examplecomponet";
// import Vanabhojanam from "./components/Vanabhojanam";
// import PresentationViewer from "./components/PresentationViewer";
// import VanabhojanamSteps from "./components/VanabhojanamaSteps";
// import RudrakshaSteps from "./components/RudrakshaSteps";
// import FreeSample from "./components/FreeSample";
// import FreeAiandGenAi from "./components/FreeAi&GenAi";
// import StudyAbroad from "./components/StudyAbroad";
// import Flow from "./components/Flow";
// import MachinesManufacturingServices from "./components/Machines&ManufacturingService";
// import LegalService from "./components/LegalService";
// import MyRotaryServices from "./components/MyRotary";
// import AllQueriesforAdmin from "./components/UserQueries";
// import Admin from "./Pages/Admin";
// import AuthorInfo from "./components/AuthorInfo";

// import Courses from "./components/GPT/Courses";
// import Accomidation from "./components/GPT/Accomidation";
// import UniversityAgents from "./components/GPT/UniversityAgents";
// import ScrollToTop from "./components/ScrollToTop";
// import FileUpload from "./Pages/FileUpload";
// import Sidebar from "./Pages/Sider";
// import CampaignsAdd from "./Pages/CampaignsAdd";
// import AllCampaignsDetails from "./Pages/AllCampaignDetail";
// import Placements from "./components/GPT/Placements";
// import ForeignExchange from "./components/GPT/ForeignExchange";
// import University from "./components/GPT/University";
// import Assistants from "./components/GPT/Assistants";
// import AuthorizeandAgencies from "./components/GPT/Authorize&Agencies";
// import QualificationSpecializationGPT from "./components/GPT/QualificationSpecializationGPT";
// import Reviews from "./components/GPT/Reviews";
// import InformationAboutCountries from "./components/GPT/InformationAboutCountries";
// import Loans from "./components/GPT/Lonsgpt";
// import Scholarship from "./components/GPT/Scholarships";
// import Logistics from "./components/GPT/Logistics";
// import Visa from "./components/GPT/Visa";
// import AccreditationsRecognization from "./components/GPT/AccreditationsRecognization";
// import ApplicationSupport from "./components/GPT/AppliocationSupport";
// import AcceptanceLetter from "./components/GPT/AcceptanceLetter";
// import AllQueries from "./Pages/AllQueries";
// import TicketHistory from "./components/TicketHistory";
// import ThankYouPage from "./components/ThankYouPage";
// import RiceSalePage from "./components/Communities";
// import RiceSalePage1 from "./components/Srila";
// import QR from "./components/qr";
// const App: React.FC = () => {
//   return (
//     <Router>
//       <ScrollToTop />
//       <div className="App">
//         <Routes>
//           <Route path="/reviews-gpt" element={<Reviews />} />
//           <Route path="/qrcode" element={<QR />} />
//           <Route
//             path="/informationaboutcountries-gpt"
//             element={<InformationAboutCountries />}
//           />
//           <Route path="/" element={<Landingpage />} />
//           <Route path="/erice" element={<Erice />} />
//           <Route path="/sider" element={<Sidebar />} />
//           <Route path="/fileupload" element={<FileUpload />} />
//           <Route
//             path="/allcampaignsdetails"
//             element={<AllCampaignsDetails />}
//           />
//           <Route path="/campaignsadd" element={<CampaignsAdd />} />{" "}
//           <Route path="/universities-gpt" element={<University />} />
//           <Route
//             path="/universitiesagents-gpt"
//             element={<AuthorizeandAgencies />}
//           />
//           <Route
//             path="/qualificationspecialization-gpt"
//             element={<QualificationSpecializationGPT />}
//           />
//           <Route path="/testandinterview-gpt" element={<Assistants />} />
//           <Route path="/admin" element={<Admin />} />
//           <Route path="/alluserqueries" element={<AllQueriesforAdmin />} />
//           <Route path="/university-agents" element={<UniversityAgents />} />
//           {/* <Route path="/AuthorInfo" element={<AuthorInfo />} />
//           <Route path="/rudraksha-vanabhojanam" element={<Flow />} /> */}
//           {/* <Route path="/rudraksha" element={<RudrakshaSteps />} /> */}
//           <Route path="/freerudraksha" Component={Freerudraksha} />
//           <Route path="/thank-you" Component={ThankYouPage} />
//           <Route path="/userqueries" Component={AllQueries} />
//           <Route path="/freesample&steelcontainer" element={<FreeSample />} />
//           <Route path="/freeaiandgenai" element={<FreeAiandGenAi />} />
//           <Route path="/studyabroad" element={<StudyAbroad />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/dashboard" element={<Dasboard />} />
//           <Route path="/normal" element={<Normal />} />
//           <Route path="/meeting" element={<Meeting />} />
//           <Route path="/legalservice" element={<LegalService />} />
//           <Route path="/myrotary" element={<MyRotaryServices />} />
//           <Route path="/courses-gpt" element={<Courses />} />
//           <Route path="/loans-gpt" element={<Loans />} />
//           <Route path="/ticket-history" element={<TicketHistory />} />
//           <Route
//             path="/machines&manufacturing"
//             element={<MachinesManufacturingServices />}
//           />
//           <Route path="/communities/landmarkresidents" element={<RiceSalePage />} />
//           <Route path="/communities/sankalpa" element={<RiceSalePage1 />} />
//           {/* <Route path="/vanabhojanam" element={<Vanabhojanam/>}/> */}
//           {/* Redirect to add a trailing slash if missing */}
//           <Route
//             path="/freerudraksha"
//             element={<Navigate to="/freerudraksha/" />}
//           />
//           <Route
//             path="/StudyAbroad"
//             element={<Navigate to="/StudyAbroad/" />}
//           />
//           <Route path="/accommodation-gpt" element={<Accomidation />} />
//           <Route path="/logistics-gpt" element={<Logistics />} />
//           <Route
//             path="/applicationsupport-gpt"
//             element={<ApplicationSupport />}
//           />
//           <Route path="/acceptanceletter-gpt" element={<AcceptanceLetter />} />
//           <Route path="/visa-gpt" element={<Visa />} />
//           <Route
//             path="/accreditations-gpt"
//             element={<AccreditationsRecognization />}
//           />
//           <Route path="placements-gpt" element={<Placements />} />
//           <Route path="scholarships-gpt" element={<Scholarship />} />
//           <Route path="/foreign-exchange" element={<ForeignExchange />} />
//           <Route path="/happy-diwali" element={<Happy_Diwali />} />
//           <Route path="/example" element={<Example variant="loading01" />} />
//           <Route path="/greenproject" element={<Greenproject />} />
//           <Route path="/el-dorado" element={<EL_Dorado />} />
//           <Route path="/whatapplogin" element={<Whatapplogin />} />
//           {/* <Route path="/example-component" element={<ExampleComponent />} /> */}
//           <Route path="/user-profile" element={<UserProfileModel />} />
//           {/* <Route path="/30NoV24Vanabhojanam" element={<PresentationViewer />} /> */}
//         </Routes>
//       </div>
//     </Router>
//   );
// };

// export default App;

import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import Landingpage from "./components/Landingpage";
import Whatapplogin from "./components/Whatapplogin";
import Freerudraksha from "./components/Freerudraksh";
import FreeSample from "./components/FreeSample";
import FreeAiandGenAi from "./components/FreeAi&GenAi";
import StudyAbroad from "./components/StudyAbroad";
import MachinesManufacturingServices from "./components/Machines&ManufacturingService";
import LegalService from "./components/LegalService";
import MyRotaryServices from "./components/MyRotary";
import HiringService from "./components/HiringService";
import Layout from "./Components1/Layout";
import Sidebar from "./Pages/Sider";
import CampaignsAdd from "./Pages/CampaignsAdd";
import AllCampaignsDetails from "./Pages/AllCampaignDetail";
import FreeChatGpt from "./Components1/FreeChatGpt";
import ScrollToTop from "./components/ScrollToTop";
import TicketHistory from "./components/TicketHistory";
import UserProfile from "./components/models/ProfileCallPage";
import Normal from "./Components1/Normal";
import NormalGpt from "./Components1/NormalGpt";
import AccomidationGpt from "./Components1/GPT's/Accomadation";
import ApplicationSupport from "./Components1/GPT's/ApplicationSupport";
import AccreditationsRecognization from "./Components1/GPT's/AccreditationsRecognization";
import CoursesGpt from "./Components1/GPT's/CoursesGpt";
import PreparationGpt from "./Components1/GPT's/PreparationGpt";
import ForeignExchange from "./Components1/GPT's/ForeignExchange";
import InformationAboutCountries from "./Components1/GPT's/InformationAboutCountries";
import LoansGpt from "./Components1/GPT's/LoansGpt";
import LogisticsGpt from "./Components1/GPT's/LogisticsGpt";
import PlacementsGpt from "./Components1/GPT's/PlacementsGpt";
import QualificationSpecializationGPT from "./Components1/GPT's/QualificationSpecializationGPT";
import VisaGpt from "./Components1/GPT's/VisaGpt";
import ReviewsGpt from "./Components1/GPT's/ReviewsGpt";
import ScholarshipGpt from "./Components1/GPT's/ScholarshipGpt";
import UniversityAgents from "./Components1/GPT's/UniversityAgents";
import University from "./Components1/GPT's/UniversityGpt";
import RiceSalePage from "./components/Communities";
import AllQueriesforAdmin from "./components/UserQueries";
import Admin from "./Pages/Admin";
import QR from "./components/qr";
import Erice from "./components/Erice";
import Greenproject from "./components/Greenproject";
import EL_Dorado from "./components/EL_Dorado";
import ThankYouPage from "./components/ThankYouPage";
import Meeting from "./components/Meeting";
import AllQueries from "./Pages/AllQueries";
import CampaignDetails from "./Components1/campaignDetails";
import RiceComparison from "./components/SteanRiceVsRawRice";

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <Routes>
          <Route path="/whatapplogin" element={<Whatapplogin />} />
          <Route path="/communities/maruthielite" element={<RiceSalePage />} />
          <Route path="/qrcode" element={<QR />} />
          <Route path="/steamricevsrawrice" element={<RiceComparison/>}/>
          {/* Landing Page (First Page) */}
          <Route path="/" element={<Landingpage />} />
          <Route path="/alluserqueries" element={<AllQueriesforAdmin />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/erice" element={<Erice />} />
          <Route path="/greenproject" element={<Greenproject />} />
          <Route path="/el-dorado" element={<EL_Dorado />} />
          <Route path="/thank-you" Component={ThankYouPage} />
          <Route path="/meeting" element={<Meeting />} />
          <Route
            path="/allcampaignsdetails"
            element={<AllCampaignsDetails />}
          />
          <Route path="/campaignsadd" element={<CampaignsAdd />} />
          <Route path="/userqueries" element={<AllQueries />} />
          <Route path="/sider" element={<Sidebar />} />
          {/* WhatsApp Login (Before Clicking Sign-in) */}
          <Route path="/communities/srilakshmi" element={<RiceSalePage />} />
          {/* Dashboard (After Login) */}
          <Route path="/normal" element={<Normal />}>
            <Route index element={<NormalGpt />} />
          </Route>
          <Route path="/dashboard" element={<Layout />}>
            {/* Default Route */}
            <Route index element={<FreeChatGpt />} />

            {/* Nested Routes */}
            <Route path="freerudraksha" element={<Freerudraksha />} />
            <Route path="ticket-history" element={<TicketHistory />} />
            <Route path="freesample-steelcontainer" element={<FreeSample />} />
            <Route path="freeai-genai" element={<FreeAiandGenAi />} />
            <Route path="studyabroad" element={<StudyAbroad />} />
            <Route path="free-chatgpt" element={<FreeChatGpt />} />
            <Route path="user-profile" element={<UserProfile />} />
            <Route path="testandinterview-gpt" element={<PreparationGpt />} />
            <Route
              path="machines-manufacturing"
              element={<MachinesManufacturingServices />}
            />
            <Route path="legalservice" element={<LegalService />} />
            <Route path="we-are-hiring" element={<HiringService />} />
            <Route path="myrotary" element={<MyRotaryServices />} />
            <Route path="accommodation-gpt" element={<AccomidationGpt />} />
            <Route
              path="applicationsupport-gpt"
              element={<ApplicationSupport />}
            />
            <Route
              path="accreditations-gpt"
              element={<AccreditationsRecognization />}
            />
            <Route path="courses-gpt" element={<CoursesGpt />} />
            <Route path="preparation-gpt" element={<PreparationGpt />} />
            <Route path="foreign-exchange" element={<ForeignExchange />} />
            <Route
              path="informationaboutcountries-gpt"
              element={<InformationAboutCountries />}
            />
            <Route path="loans-gpt" element={<LoansGpt />} />
            <Route path="logistics-gpt" element={<LogisticsGpt />} />
            <Route path="placements-gpt" element={<PlacementsGpt />} />
            <Route
              path="qualificationspecialization-gpt"
              element={<QualificationSpecializationGPT />}
            />
            <Route path="visa-gpt" element={<VisaGpt />} />
            <Route path="reviews-gpt" element={<ReviewsGpt />} />
            <Route path="scholarships-gpt" element={<ScholarshipGpt />} />
            <Route
              path="universitiesagents-gpt"
              element={<UniversityAgents />}
            />
            <Route path="universities-gpt" element={<University />} />
            <Route path="campaign/:type" element={<CampaignDetails />} />
            {/* Add more nested routes as needed */}
          </Route>
          {/* Redirect Unknown Routes to Landing Page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
