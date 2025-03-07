import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import CartProvider from "./until/CartProvider";

import Landingpage from "./components/Landingpage";
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
import Admin from "./Pages/Admin";
import QR from "./components/qr";
import ThankYouPage from "./components/ThankYouPage";
import BMVCOIN from "./Components1/BMVCOIN";
import WhatsappLogin from "./Components1/Auth/WhatsappLogin";
import WhatsappRegister from "./Components1/Auth/WhatsappRegister";
import AllQueries from "./Pages/AllQueries";
import RequireAuth from "./auth/RequireAuth";
import ItemDisplayPage from "./kart/itemsdisplay";
import MyWalletPage from "./kart/Wallet";
import CartPage from "./kart/Cart";
import MyOrders from "./kart/Myorders";
import ProfilePage from "./kart/Profile";
import SubscriptionPage from "./kart/Subscription";
import WriteToUs from "./kart/Writetous";
import TicketHistoryPage from "./kart/Tickethistory";
import ManageAddressesPage from "./kart/Address";
import CheckoutPage from "./kart/Checkout";
import PrivacyPolicy from "./kart/Privacypolicy";
import ReferralPage from "./kart/Referral";
import DashboardMain from "./Dashboard/Dashboardmain";
import BMVPDF from "./components/bmvpdf";
import FreeChatGPTmain from "./Dashboard/FreechatGPTmain";
import BMVCOINmain from "./Dashboard/BMVcoinmain";
import Content1 from "./Dashboard/Content";
import CampaignDetails from "./Components1/campaignDetails";
import FreeChatGPTnormal
 from "./Dashboard/Freechatgptnormal";
import HiddenLogin from "./Components1/Auth/HiddenLogin";

const App: React.FC = () => {
  return (
    <CartProvider>
    <Router>
      <ScrollToTop />
      <div className="App">
        <Routes>
          <Route path="/whatsapplogin" element={<WhatsappLogin />} />
          <Route path="/whatsappregister" element={<WhatsappRegister />} />
          <Route path="/hiddenlogin" element = {<HiddenLogin/>}/>
          <Route path="/communities/maruthielite" element={<RiceSalePage />} />
          <Route path="/qrcode" element={<QR />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="/freechatgptnormal" element={<FreeChatGPTnormal />} />

          {/* Landing Page (First Page) */}
          <Route path="/" element={<Landingpage />} />

         
          <Route path="/allqueries" element={<AllQueries />} />
          <Route path="/admin" element={<Admin />} />
          <Route
            path="/allcampaignsdetails"
            element={<AllCampaignsDetails />}
          />
          <Route path="/campaignsadd" element={<CampaignsAdd />} />
          {/* <Route path="/example" element={<Example />} /> */}
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
            
            
            
            <Route path="free-chatgpt" element={<FreeChatGpt />} />
            <Route path="user-profile" element={<UserProfile />} />
            <Route path="bmvcoin" element={<BMVCOIN />} />
            
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
            {/* Add more nested routes as needed */}
          </Route>

          {/* Redirect Unknown Routes to Landing Page */}
          <Route path="*" element={<Navigate to="/" replace />} />

          {/* {kartpage routes} */}
          {/* <Route path="/buyRice" element={<Ricebags />} /> */}
          
          
          <Route path="/privacypolicy" element={<PrivacyPolicy/>}/>
          <Route path="/bmvpdf" element={<BMVPDF />} />
          
          {/* {Dashboard Main routes} */}
          <Route path="/main" element={<RequireAuth><Content1/></RequireAuth>} >
          <Route
              index
              element={<Navigate to="/main/dashboard/products" replace />}
            />
          <Route path="dashboard/:tab" element={<DashboardMain />} />
          {/* <Route path="services/freerudraksha" element={<FreeRudrakshaPage/>} /> */}
          <Route path="services/freerudraksha" element={<Freerudraksha />} />
          <Route path="services/freeai-genai" element={<FreeAiandGenAi />} />
          <Route path="services/campaign/:type" element={<CampaignDetails />} />
          <Route path="services/studyabroad" element={<StudyAbroad />} />
          <Route path="services/Freechatgpt" element={<FreeChatGPTmain/>} />
          <Route path="services/myrotary" element={<MyRotaryServices />} />
          <Route path="services/bmvcoin" element={<BMVCOINmain/>} />
          <Route path="services/freesample-steelcontainer" element={<FreeSample />} />
          <Route
              path="services/machines-manufacturing"
              element={<MachinesManufacturingServices />}
            />
          <Route path="services/legalservice" element={<LegalService />} />
          <Route path="services/we-are-hiring" element={<HiringService />} />
          <Route path="wallet" element={<RequireAuth><MyWalletPage /></RequireAuth>} />
          <Route path="mycart" element={<CartPage />} />
          <Route path="myorders" element={<RequireAuth><MyOrders /></RequireAuth>} />
          <Route path="profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
          <Route path="referral" element={<RequireAuth><ReferralPage /></RequireAuth>} />
          <Route path="itemsdisplay/:itemId" element={<ItemDisplayPage />} />
          <Route path="subscription" element={<RequireAuth><SubscriptionPage /></RequireAuth>} />
          <Route path="writetous/:id" element={<RequireAuth><WriteToUs /></RequireAuth>} />
          <Route path="writetous" element={<RequireAuth><WriteToUs /></RequireAuth>} />
          <Route path="tickethistory" element={<RequireAuth><TicketHistoryPage /></RequireAuth>} />
          <Route path="checkout" element={<RequireAuth><CheckoutPage /></RequireAuth>} />
          <Route path="manageaddresses" element={<RequireAuth><ManageAddressesPage /></RequireAuth>} />
          </Route>
        </Routes>
      </div>
    </Router>
  </CartProvider>
  );
};

export default App;
