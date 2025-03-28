import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import CartProvider from "./until/CartProvider";

import Landingpage from "./components/Landingpage";
import Freerudraksha from "./components/Services/Freerudraksh";
import FreeSample from "./components/Services/FreeSample";
import FreeAiandGenAi from "./components/Services/FreeAi&GenAi";
import StudyAbroad from "./components/Services/StudyAbroad";
import MachinesManufacturingServices from "./components/Services/Machines&ManufacturingService";
import LegalService from "./components/Services/LegalService";
import MyRotaryServices from "./components/Services/MyRotary";
import HiringService from "./components/Services/HiringService";

import Sidebar from "./AskoxyAdmin/Sider";
import CampaignsAdd from "./AskoxyAdmin/CampaignsAdd";
import AllCampaignsDetails from "./AskoxyAdmin/AllCampaignDetail";

import ScrollToTop from "./components/ScrollToTop";
import TicketHistory from "./components/TicketHistory";

import AccomidationGpt from "./components/GPT's/Accomadation";
import ApplicationSupport from "./components/GPT's/ApplicationSupport";
import AccreditationsRecognization from "./components/GPT's/AccreditationsRecognization";
import CoursesGpt from "./components/GPT's/CoursesGpt";
import PreparationGpt from "./components/GPT's/PreparationGpt";
import ForeignExchange from "./components/GPT's/ForeignExchange";
import InformationAboutCountries from "./components/GPT's/InformationAboutCountries";
import LoansGpt from "./components/GPT's/LoansGpt";
import LogisticsGpt from "./components/GPT's/LogisticsGpt";
import PlacementsGpt from "./components/GPT's/PlacementsGpt";
import QualificationSpecializationGPT from "./components/GPT's/QualificationSpecializationGPT";
import VisaGpt from "./components/GPT's/VisaGpt";
import ReviewsGpt from "./components/GPT's/ReviewsGpt";
import ScholarshipGpt from "./components/GPT's/ScholarshipGpt";
import UniversityAgents from "./components/GPT's/UniversityAgents";
import University from "./components/GPT's/UniversityGpt";
import RiceSalePage from "./components/Communities";
import Admin from "./AskoxyAdmin/Admin";
import QR from "./components/qr";
import ThankYouPage from "./components/ThankYouPage";

import WhatsappLogin from "./Pages/Auth/WhatsappLogin";
import WhatsappRegister from "./Pages/Auth/WhatsappRegister";
import AllQueries from "./AskoxyAdmin/AllQueries";
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
import CampaignDetails from "./components/campaignDetails";
import FreeChatGPTnormal from "./Dashboard/Freechatgptnormal";
import WomensDay from "./components/WomensDay";
import HiddenLogin from "./Pages/Auth/HiddenLogin";
import TestimonialsPage from "./Dashboard/TestimoinalsOXY";
import RiceComparison from "./components/SteanRiceVsRawRice";
import RegisteredUser from "./AskoxyAdmin/RegisteredUser";
import Login from "./AskoxyAdmin/Login";
import RiceGpt from "./components/RiceGpt";
import OxyGroup from "./components/OxygroupPdf";
import BarcodeScanner from "./Dashboard/BarcodeScanner";
import FREEAIANDGENAI from "./components/AIandGenAi";
import OxyLoans from "./components/Services/OxyLoans";
import UniversityOffers from "./Dashboard/Offerletter"
const App: React.FC = () => {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <div className="App">
          <Routes>
            <Route path="/whatsapplogin" element={<WhatsappLogin />} />
            <Route path="/whatsappregister" element={<WhatsappRegister />} />
            <Route path="/hiddenlogin" element={<HiddenLogin />} />
            <Route
              path="/communities/maruthielite"
              element={<RiceSalePage />}
            />
            <Route path="/qrcode" element={<QR />} />
            <Route path="/oxygroup" element={<OxyGroup />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
            <Route path="/freechatgptnormal" element={<FreeChatGPTnormal />} />
            <Route
              path="/proud-lender/testimonials"
              element={<TestimonialsPage />}
            />
            <Route path="/steamricevsrawrice" element={<RiceComparison />} />
            <Route
              path="/aiandgenaivsverficationandvalidation"
              element={<FREEAIANDGENAI />}
            />
            {/* Landing Page (First Page) */}
            <Route path="/" element={<Landingpage />} />

            <Route path="/allqueries" element={<AllQueries />} />
            <Route path="/admin" element={<Login />} />
            <Route path="/admndashboard" element={<Admin />} />
            <Route path="/registeredUsers" element={<RegisteredUser />} />
            <Route
              path="/allcampaignsdetails"
              element={<AllCampaignsDetails />}
            />
            <Route path="/campaignsadd" element={<CampaignsAdd />} />
            {/* <Route path="/example" element={<Example />} /> */}
            <Route path="/sider" element={<Sidebar />} />
            {/* WhatsApp Login (Before Clicking Sign-in) */}
            <Route path="/communities/srilakshmi" element={<RiceSalePage />} />
            <Route path="/womensday" element={<WomensDay />} />
            {/* Dashboard (After Login) */}

            {/* Redirect Unknown Routes to Landing Page */}
            <Route path="*" element={<Navigate to="/" replace />} />

            {/* {kartpage routes} */}
            {/* <Route path="/buyRice" element={<Ricebags />} /> */}

            <Route path="/privacypolicy" element={<PrivacyPolicy />} />
            <Route path="/bmvpdf" element={<BMVPDF />} />

            {/* {Dashboard Main routes} */}
            <Route
              path="/main"
              element={
                <RequireAuth>
                  <Content1 />
                </RequireAuth>
              }
            >
              <Route
                index
                element={<Navigate to="/main/dashboard/products" replace />}
              />
              <Route
                path="/main/dashboard/accomdation-gpt"
                element={<AccomidationGpt />}
              />
              <Route
                path="/main/dashboard/accreditations-gpt"
                element={<AccreditationsRecognization />}
              />
              <Route
                path="/main/dashboard/applicationsupport-gpt"
                element={<ApplicationSupport />}
              />
              <Route
                path="/main/dashboard/courses-gpt"
                element={<CoursesGpt />}
              />{" "}
              <Route
                path="/main/dashboard/preparation-gpt"
                element={<PreparationGpt />}
              />
              <Route
                path="/main/dashboard/foreign-exchange"
                element={<ForeignExchange />}
              />
              <Route
                path="/main/dashboard/informationaboutcountries-gpt"
                element={<InformationAboutCountries />}
              />
              <Route path="/main/dashboard/loans-gpt" element={<LoansGpt />} />
              <Route
                path="/main/dashboard/logistics-gpt"
                element={<LogisticsGpt />}
              />
              <Route
                path="/main/dashboard/barcodescanner"
                element={
                  <RequireAuth>
                    <BarcodeScanner />
                  </RequireAuth>
                }
              />
              <Route
                path="/main/dashboard/placements-gpt"
                element={<PlacementsGpt />}
              />
              <Route
                path="/main/dashboard/qualificationspecialization-gpt"
                element={<QualificationSpecializationGPT />}
              />
              <Route
                path="/main/dashboard/universities-gpt"
                element={<University />}
              />
              <Route path ="/main/dashboard/offer-letter-samples" element={<UniversityOffers/>} />
              <Route
                path="/main/dashboard/scholarships-gpt"
                element={<ScholarshipGpt />}
              />
              <Route
                path="/main/dashboard/reviews-gpt"
                element={<ReviewsGpt />}
              />
              <Route path="/main/dashboard/rice-gpt" element={<RiceGpt />} />
              <Route
                path="/main/dashboard/universitiesagents-gpt"
                element={<UniversityAgents />}
              />
              <Route path="/main/dashboard/visa-gpt" element={<VisaGpt />} />
              <Route path="dashboard/:tab" element={<DashboardMain />} />
              {/* <Route path="services/freerudraksha" element={<FreeRudrakshaPage/>} /> */}
              <Route
                path="services/freerudraksha"
                element={<Freerudraksha />}
              />
              <Route
                path="services/freeai-genai"
                element={<FreeAiandGenAi />}
              />
         
              <Route
                path="services/campaign/:type"
                element={<CampaignDetails />}
              />
              <Route path="services/studyabroad" element={<StudyAbroad />} />
              <Route
                path="services/Freechatgpt"
                element={<FreeChatGPTmain />}
              />
              <Route path="services/myrotary" element={<MyRotaryServices />} />
              <Route path="services/bmvcoin" element={<BMVCOINmain />} />
              <Route
                path="services/freesample-steelcontainer"
                element={<FreeSample />}
              />
              <Route
                path="services/machines-manufacturing"
                element={<MachinesManufacturingServices />}
              />
              <Route path="service/oxyloans-service" element={<OxyLoans/>}/>
              <Route path="services/legalservice" element={<LegalService />} />
              <Route
                path="services/we-are-hiring"
                element={<HiringService />}
              />
              <Route
                path="wallet"
                element={
                  <RequireAuth>
                    <MyWalletPage />
                  </RequireAuth>
                }
              />
              <Route path="mycart" element={<CartPage />} />
              <Route
                path="myorders"
                element={
                  <RequireAuth>
                    <MyOrders />
                  </RequireAuth>
                }
              />
              <Route
                path="profile"
                element={
                  <RequireAuth>
                    <ProfilePage />
                  </RequireAuth>
                }
              />
              <Route
                path="referral"
                element={
                  <RequireAuth>
                    <ReferralPage />
                  </RequireAuth>
                }
              />
              <Route
                path="itemsdisplay/:itemId"
                element={<ItemDisplayPage />}
              />
              <Route
                path="subscription"
                element={
                  <RequireAuth>
                    <SubscriptionPage />
                  </RequireAuth>
                }
              />
              <Route
                path="writetous/:id"
                element={
                  <RequireAuth>
                    <WriteToUs />
                  </RequireAuth>
                }
              />
              <Route
                path="writetous"
                element={
                  <RequireAuth>
                    <WriteToUs />
                  </RequireAuth>
                }
              />
              <Route
                path="tickethistory"
                element={
                  <RequireAuth>
                    <TicketHistoryPage />
                  </RequireAuth>
                }
              />
              <Route
                path="checkout"
                element={
                  <RequireAuth>
                    <CheckoutPage />
                  </RequireAuth>
                }
              />
              <Route
                path="manageaddresses"
                element={
                  <RequireAuth>
                    <ManageAddressesPage />
                  </RequireAuth>
                }
              />
            </Route>
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
};

export default App;
