import React, { useEffect } from "react";
import { Route, useLocation, Routes, Navigate } from "react-router-dom";
import CartProvider from "./until/CartProvider";

import Landingpage from "./components/Landingpage";
import Freerudraksha from "./components/Services/Freerudraksh";
import TermsAndConditions from "./kart/TermsAndConditions";
import RCSConsentForm from "./kart/RCSConsentForm";
import FreeSample from "./components/Services/FreeSample";
import FreeAiandGenAi from "./components/Services/FreeAi&GenAi";
import StudyAbroad from "./components/Services/StudyAbroad";
import MachinesManufacturingServices from "./components/Services/Machines&ManufacturingService";
import LegalService from "./components/Services/LegalService";
import MyRotaryServices from "./components/Services/MyRotary";
import HiringService from "./components/Services/HiringService";
import DesignTemplatesPage from "./Templates/Templatehome";
import UniversityPromoCard from "./Templates/UniversityPromoCard";
import PromoCard from "./Templates/PromoCard";
import RiceOfferFAQs from "./Dashboard/Faqs";
import MyCrypto from "./Dashboard/MyCrypto";
import LoanManagementLandingPage from "./components/LoanManagementLandingPage";
import AdminSidebar from "./AskoxyAdmin/Sider";
import Home from "./Dashboard/Home";
import CampaignsAdd from "./AskoxyAdmin/CampaignsAdd";
import AllCampaignsDetails from "./AskoxyAdmin/AllCampaignDetail";
import ForgotPasswordPage from "./Pages/Auth/Forgotpage";
import { useGtagPageView } from "./Pages/Auth/useGtagPageView";

import ScrollToTop from "./components/ScrollToTop";

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
// import RiceSalePage from "./components/Communities";
import Admin from "./AskoxyAdmin/Admin";
import Climatecrisis from "./components/Climatecrisis";
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
import SuperAdminComments from "./AskoxyAdmin/SuperAdminComments";
import TestimonialsPage from "./Dashboard/TestimoinalsOXY";
import RiceComparison from "./components/SteanRiceVsRawRice";
import RegisteredUser from "./AskoxyAdmin/RegisteredUser";
import Login from "./AskoxyAdmin/Login";
import RiceGpt from "./components/RiceGpt";
import OxyGroup from "./components/OxygroupPdf";
import BarcodeScanner from "./Dashboard/BarcodeScanner";
import FREEAIANDGENAI from "./components/AIandGenAi";
import OxyLoans from "./components/Services/OxyLoans";
import UniversityOffers from "./Dashboard/Offerletter";
import PinkFunding from "./components/PinkFunding";
import CurrentLandingPage from "./components/CurrentLandinPage";
import PlanOfTheDay from "./Taskmanagement/PlanOfTheDay";

import AllStatusPage from "./Taskmanagement/AllStatus";
import AssignedTasksPage from "./Taskmanagement/AssignedTasks";

import TaskAssignedUser from "./Taskmanagement/TaskAssignedUser";
import TaskUpdate from "./Taskmanagement/EndoftheDay";
import UserRegister from "./Taskmanagement/UserRegister";
import UserLogin from "./Taskmanagement/UserLogin";
import CallerHistoryPage from "./AskoxyAdmin/HelpdeskTodayCalls";
// *************************PARTNER START****************************//

import PartnerLogin from "./PartnerWeb/PartnerLogin";
import PartnerHome from "./PartnerWeb/PartnerHome";
import MainPage from "./PartnerWeb/MainPage";
import NewOrders from "./PartnerWeb/NewOrders";
import OrderDetailsPage from "./PartnerWeb/OrderDetials";
import AllOrders from "./PartnerWeb/AllOrders";
import DeliveryBoyList from "./PartnerWeb/DeliveryBoyList";
import PartnerItemsList from "./PartnerWeb/PartnerItemsList";
import DbOrderDetails from "./PartnerWeb/DbOrderList";
import AddBlog from "./AskoxyAdmin/AddBlog";
import OrderStatsDashboard from "./AskoxyAdmin/Stats";
import StockUpdate from "./AskoxyAdmin/Stockupdate";

import Register from "./AskoxyAdmin/Register";
import AssignedDataPage from "./AskoxyAdmin/AssignedData";
import HelpDeskUsersDashboard from "./AskoxyAdmin/HelpDeskUsers";
import DataAssigned from "./AskoxyAdmin/DataAssigned";
import ReferredData from "./AskoxyAdmin/RefferedData";

import FreeRiceBlog from "./components/FreeRice";
import MeyaporeMetro from "./components/MeyaporeMetro";
import { SearchProvider } from "./until/SearchContext";
import SearchMain from "./Dashboard/SearchMain";
import OrderReport from "./AskoxyAdmin/OrderReport";
import LeaveApplicationPage from "./Taskmanagement/LeaveApplicationPage";
import TeamLeaveStatus from "./Taskmanagement/TeamLeaveStatus";
import FeedbackDashboard from "./AskoxyAdmin/FeedBack";
import MobileNumberUpdate from "./Taskmanagement/EmployeeProfilePage";
import HelpDeskDashboard from "./AskoxyAdmin/HelpDeskDashboard";
import ExchangeOrdersPage from "./PartnerWeb/ExchangeOrders";
import GSTRiceFAQ from "./components/GstFAQ";
import LandingPage from "./GLMS/LandingPage";
import CASDashboard from "./GLMS/CAS/Pages/CASDashboard";
import CASRouteRenderer from "./GLMS/CAS/Pages/CASRouteRenderer";
import CMSRouteRenderer from "./GLMS/CMS/Pages/CMSRoutes";
import CMSDashboard from "./GLMS/CMS/Pages/CMSDashboard";
import FMSDashboard from "./GLMS/FMS/Pages/FMSDashboard";
import FMSRouteRenderer from "./GLMS/FMS/Pages/FMSRoutes";
import JobStreet from "./GLMS/JobStreet/JobStreet";
import OrdersByPincode from "./AskoxyAdmin/Pincodewiseorders";
import Feedback from "./components/Feedback";

import AIBlockchainAndItServices from "./AIBlockchainAndItSev/AIBlockchainAndItServices";
import CACSService from "./CACSServices/CaCsServices";
import GoldAndSilverAndDiamond from "./GoldAndSilverAndDiamonds/GoldAndSilverAndDiamonds";
import LoansInvestmentsLandingPage from "./LoansInvestments/LoanInvestmentsLandingPage";
import RealEstate from "./Real Estate/Real Estate/RealEstate";
import Nyayagpt from "./Nyayagpt/Nyayagpt/Nyayagpt";

import Rice2RoboEcommers from "./Rice2RoboEcommers/Rice2RoboEcommers/Rice2RoboEcommers";
import ChatApp from "./components/OpenAi";

// *************************STUDY ABRAD****************************//
import CoursesPage from "./StudyAbroad/Course";
import UserSelectionPage from "./StudyAbroad/Homepage";

import UniversityListPage from "./StudyAbroad/Universitylist";
import AllUniversities from "./StudyAbroad/AllUniversities";

import StudyAbroadLandingPage from "./StudyAbroad/StudyAbroadLandingPage";
import StudentMainDashboard from "./StudyAbroad/StudentMainDashboard";

const App: React.FC = () => {
  const location = useLocation();
  // Use the Google Analytics tracking hook
  useGtagPageView();

  useEffect(() => {
    const validEntryPoints = [
      "/",
      "/future",
      "/freerice",
      "/glms",
      "/miyapurmetro",
      "/cas",
      "/fms",
      "/cms",
      "/aiblockchainanditservices",
      "/caandcaservices",
      "/goldandsilveranddiamonds",
      "/loansinvestments",
      "/realestate",
      "/rice2roboecommers",
      "/nyayagpt",
      "/student-home",
      "/studyabroad"
    ];
    if (validEntryPoints.includes(location.pathname)) {
      console.log("Setting entryPoint:", location.pathname); // Debug log
      localStorage.setItem("entryPoint", location.pathname);
    }
  }, [location.pathname]);
  return (
    <CartProvider>
      <SearchProvider>
        <ScrollToTop />
        <div className="App">
          <Routes>
            {/* ----------------------------- */}
            <Route path="dashboard/:tab" element={<DashboardMain />} />
            <Route path="services/freerudraksha" element={<Freerudraksha />} />
            <Route path="services/freeai-genai" element={<FreeAiandGenAi />} />
            <Route
              path="services/campaign/:type"
              element={<CampaignDetails />}
            />
            <Route path="services/studyabroad" element={<StudyAbroad />} />
            <Route path="services/Freechatgpt" element={<FreeChatGPTmain />} />
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
            <Route path="service/oxyloans-service" element={<OxyLoans />} />
            <Route path="services/legalservice" element={<LegalService />} />
            <Route path="services/we-are-hiring" element={<HiringService />} />
            {/* ----------------------- */}
            <Route path="/whatsapplogin" element={<WhatsappLogin />} />
            <Route path="/whatsappregister" element={<WhatsappRegister />} />
            <Route path="/freerice" element={<FreeRiceBlog />} />
            <Route path="/userFeedback" element={<Feedback />} />
            <Route path="/miyapurmetro" element={<MeyaporeMetro />} />
            <Route
              path="/usermobilenumberupdate"
              element={<MobileNumberUpdate />}
            />
            <Route path="/userregister" element={<UserRegister />} />
            {/* <Route path="/glmshome" element={<UseCases />} /> */}
            <Route path="/jobstreet" element={<JobStreet />} />
            <Route
              path="/termsandconditions"
              element={<TermsAndConditions />}
            />
            <Route path="/rcsconsentform" element={<RCSConsentForm />} />
            <Route
              path="/loanmanagement"
              element={<LoanManagementLandingPage />}
            />
            <Route path="/cas" element={<CASDashboard />} />
            <Route
              path="/cas/:useCaseId/:type"
              element={<CASRouteRenderer />}
            />
            <Route path="/cms" element={<CMSDashboard />} />
            <Route
              path="/cms/:useCaseId/:type"
              element={<CMSRouteRenderer />}
            />
            <Route path="/fms" element={<FMSDashboard />} />
            <Route
              path="/fms/:useCaseId/:type"
              element={<FMSRouteRenderer />}
            />
            <Route path="/glms" element={<LandingPage />} />
            <Route
              path="/aiblockchainanditservices"
              element={<AIBlockchainAndItServices />}
            />
            <Route path="/generateimage" element={<ChatApp />} />
            <Route path="/caandcsservices" element={<CACSService />} />
            <Route
              path="/goldandsilveranddiamonds"
              element={<GoldAndSilverAndDiamond />}
            />
            <Route
              path="/loansinvestments"
              element={<LoansInvestmentsLandingPage />}
            />
            <Route path="/realestate" element={<RealEstate />} />
            <Route path="/rice2roboecommers" element={<Rice2RoboEcommers />} />
            <Route path="/nyayagpt" element={<Nyayagpt />} />
            <Route path="/gstonrice" element={<GSTRiceFAQ />} />
            <Route path="/userlogin" element={<UserLogin />} />{" "}
            <Route path="/userPanelLayout" element={<PlanOfTheDay />} />
            <Route path="/planoftheday" element={<PlanOfTheDay />} />
            <Route path="/taskupdated" element={<TaskUpdate />} />
            <Route path="/leaveapproval" element={<LeaveApplicationPage />} />
            <Route path="/leavestatus" element={<TeamLeaveStatus />} />
            <Route path="/all-statuses" element={<AllStatusPage />} />
            <Route path="/assigned-task" element={<AssignedTasksPage />} />
            <Route path="/taskassigneduser" element={<TaskAssignedUser />} />
            <Route path="/hiddenlogin" element={<HiddenLogin />} />
            <Route path="/forgot" element={<ForgotPasswordPage />} />
            <Route path="/faqs" element={<RiceOfferFAQs />} />
            {/* study abrad */}
            <Route path="/studyabroad" element={<StudyAbroadLandingPage />} />
            <Route path="/all-universities" element={<AllUniversities />} />
            <Route
              path="/student-dashboard"
              element={<StudentMainDashboard />}
            />
            <Route path="/student-home" element={<UserSelectionPage />} />
            {/* <Route path="/universities" element={<UniversityDetailsPage />} /> */}
            <Route
              path="/listofuniversities"
              element={<UniversityListPage />}
            />
            <Route path="/course" element={<CoursesPage />} />
            {/* <Route
              path="/communities/maruthielite"
              element={<RiceSalePage />}
            /> */}
            <Route path="/qrcode" element={<QR />} />
            <Route path="/oxygroup" element={<OxyGroup />} />
            <Route path="/pinkfunding" element={<PinkFunding />} />
            <Route path="/climatecrisis" element={<Climatecrisis />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
            <Route path="/freechatgptnormal" element={<FreeChatGPTnormal />} />
            <Route
              path="/proud-lender/testimonials"
              element={<TestimonialsPage />}
            />
            <Route path="/templates" element={<DesignTemplatesPage />} />
            <Route path="/template1" element={<UniversityPromoCard />} />
            <Route path="/template2" element={<PromoCard />} />
            <Route path="/steamricevsrawrice" element={<RiceComparison />} />
            <Route
              path="/aiandgenaivsverficationandvalidation"
              element={<FREEAIANDGENAI />}
            />
            {/* Landing Page (First Page) */}
            <Route path="/future" element={<Landingpage />} />
            <Route path="/" element={<CurrentLandingPage />} />
            {/* WhatsApp Login (Before Clicking Sign-in) */}
            {/* <Route path="/communities/srilakshmi" element={<RiceSalePage />} /> */}
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
              <Route
                path="/main/dashboard/offer-letter-samples"
                element={<UniversityOffers />}
              />
              <Route
                path="/main/dashboard/scholarships-gpt"
                element={<ScholarshipGpt />}
              />
              <Route
                path="/main/dashboard/reviews-gpt"
                element={<ReviewsGpt />}
              />
              <Route path="/main/dashboard/home" element={<Home />} />
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
              <Route path="service/oxyloans-service" element={<OxyLoans />} />
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
                path="crypto"
                element={
                  <RequireAuth>
                    <MyCrypto />
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
              <Route path="search-main" element={<SearchMain />} />
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
            {/* Partner start */}
            <Route path="/partnerLogin" element={<PartnerLogin />} />
            <Route path="/home" element={<PartnerHome />}>
              <Route index element={<MainPage />} />{" "}
              {/* <Route path="newOrders" element={<NewOrders />} />
              <Route path="acceptedOrders" element={<AcceptedOrders />} />
              <Route path="assignedOrders" element={<AssignedOrders />} /> */}
              <Route path="newOrders/:status" element={<NewOrders />} />
              <Route path="acceptedOrders/:status" element={<NewOrders />} />
              <Route path="assignedOrders/:status" element={<NewOrders />} />
              <Route path="orderDetails" element={<OrderDetailsPage />} />
              <Route path="allOrders" element={<AllOrders />} />
              <Route path="dbList" element={<DeliveryBoyList />} />
              <Route path="queryManagement" element={<AllQueries />} />
              <Route path="scan-qr" element={<BarcodeScanner />} />
              <Route path="itemsList" element={<PartnerItemsList />} />
              <Route path="dbOrderList" element={<DbOrderDetails />} />
              <Route path="feedback" element={<FeedbackDashboard />} />
              <Route path="exchangeorders" element={<ExchangeOrdersPage />} />
              <Route path="orderReport" element={<OrderReport />} />
              <Route path="orderstats" element={<OrderStatsDashboard />} />
              <Route path="updatestock" element={<StockUpdate />} />
            </Route>
            {/* Partner end */}
            {/* ----------Admin Routes Start---------- */}
            <Route path="/admin" element={<Login />} />
            <Route path="/adminRegister" element={<Register />} />
            <Route path="/admn" element={<AdminSidebar />}>
              <Route path="dashboard" element={<Admin />} />
              <Route path="registeredUsers" element={<RegisteredUser />} />
              <Route path="allqueries" element={<AllQueries />} />
              <Route
                path="allcampaignsdetails"
                element={<AllCampaignsDetails />}
              />
              <Route path="campaignsadd" element={<CampaignsAdd />} />
              <Route path="assignedData" element={<AssignedDataPage />} />
              <Route
                path="helpDeskUsers"
                element={<HelpDeskUsersDashboard />}
              />
              <Route path="dataAssigned" element={<DataAssigned />} />
              <Route path="referredData" element={<ReferredData />} />
              <Route path="orderReport" element={<OrderReport />} />
              <Route path="feedback" element={<FeedbackDashboard />} />
              <Route path="helpdashboard" element={<HelpDeskDashboard />} />
              <Route path="todaycalls" element={<CallerHistoryPage />} />
              <Route path="addblogs" element={<AddBlog />} />
              <Route path="orderstats" element={<OrderStatsDashboard />} />
              <Route path="updatestock" element={<StockUpdate />} />
              <Route
                path="superAdminComments"
                element={<SuperAdminComments />}
              />
              <Route path="pincodeorders" element={<OrdersByPincode />} />
            </Route>
            {/* ----------Admin Routes end---------- */}
          </Routes>
        </div>
      </SearchProvider>
    </CartProvider>
  );
};

export default App;
