import React, { useEffect } from "react";

import { Route, useLocation, Routes, Navigate } from "react-router-dom";
import CartProvider from "./until/CartProvider";

import Landingpage from "./components/Landingpage";
// import Freerudraksha from "./components/Services/Freerudraksh";
import TermsAndConditions from "./kart/TermsAndConditions";
import RCSConsentForm from "./kart/RCSConsentForm";
import FreeSample from "./components/Services/FreeSample";
import FreeAiandGenAi from "./components/Services/FreeAi&GenAi";

import MachinesManufacturingServices from "./components/Services/Machines&ManufacturingService";
import LegalService from "./components/Services/LegalService";
import MyRotaryServices from "./components/Services/MyRotary";
import HiringService from "./components/Services/HiringService";
import DesignTemplatesPage from "./Templates/Templatehome";
import CAServicesItems from "./components/CAServicesItems";
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
import InsuranceLLmVoice from "./GenOxy/components/InsuranceLLMVoice";
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
import BlogsPage from "./Dashboard/BlogPage";
import ServicesPage from "./Dashboard/ServicesPage";
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
import Content2 from "./FREEAIBOOK/Content";
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
import VehicleManagement from "./PartnerWeb/Addvechicle";
import OrderDetailsPage from "./PartnerWeb/OrderDetials";
import AllOrders from "./PartnerWeb/AllOrders";
import DeliveryBoyList from "./PartnerWeb/DeliveryBoyList";
import PartnerItemsList from "./PartnerWeb/PartnerItemsList";
import DbOrderDetails from "./PartnerWeb/DbOrderList";
import AddBlog from "./AskoxyAdmin/AddBlog";
import OrderStatsDashboard from "./AskoxyAdmin/Stats";
import StockUpdate from "./AskoxyAdmin/Stockupdate";
import ContactUs from "./kart/ContactUs";
import Register from "./AskoxyAdmin/Register";
import AssignedDataPage from "./AskoxyAdmin/AssignedData";
import HelpDeskUsersDashboard from "./AskoxyAdmin/HelpDeskUsers";
import DataAssigned from "./AskoxyAdmin/AskoxyUsers";
import ReferredData from "./AskoxyAdmin/RefferedData";
import ProtectedRoute from "./auth/ProtectedRoute";
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
import MetroLogin from "./Pages/Auth/MetroLogin";
import Rice2RoboEcommers from "./Rice2RoboEcommers/Rice2RoboEcommers/Rice2RoboEcommers";

import HomePage from "./Retailshop/Pages/Home";
import ShopFormPage from "./Retailshop/Pages/ShopFormPage";
import ShopListPage from "./Retailshop/Pages/ShopListPage";
import CarnivalFormPage from "./Retailshop/Pages/CarnivalFormPage";
import CarnivalListPage from "./Retailshop/Pages/CarnivalListPage";
import ShopEditForm from "./Retailshop/components/ShopEditForm";
import CarnivalEditPage from "./Retailshop/Pages/CarnivalEditPage";

import CreateAgentMain from "./AgentStore/CreateAgentMain";
import CreateAgentStep2 from "./AgentStore/AgentBusiness";

import CreateAgentWizard from "./AgentStore/CreateAgentWizard";

// *************************STUDY ABRAD****************************//

import UserSelectionPage from "./StudyAbroad/Homepage";

import UniversityListPage from "./StudyAbroad/Universitylist";
import AllUniversities from "./StudyAbroad/AllUniversities";
import LandingPage1 from "./AIServicesHub/LandingPage";
import StudyAbroadLandingPage from "./StudyAbroad/StudyAbroadLandingPage";
import StudentMainDashboard from "./StudyAbroad/StudentMainDashboard";
import BlogDetails from "./components/BlogDetails";

import GenOxy from "./GenOxy/Genoxy";
import RealtimePage from "./GenOxy/components/RealTimeMainscreen";
import VisaVoice from "./Visavoice/RealTimeMainscreen";
import JobDetails from "./components/JobDetails";
import AddJob from "./AskoxyAdmin/AddJob";
import VersionUpdate from "./PartnerWeb/VersionUpdate";
import OfferImagesUpdate from "./PartnerWeb/OfferImagesUpdate";
import JobsAdminPage from "./AskoxyAdmin/Alljobdetails";
import AddReference from "./PartnerWeb/AddReference";
import UserAppliedJob from "./AskoxyAdmin/UserAppliedJobs";
import StockTable from "./PartnerWeb/StockDetails";
import MarketReport from "./PartnerWeb/Marketreport";
import FreeAiBookLandingPage from "./FREEAIBOOK/LandingPage";
import FreeAiBook from "./FREEAIBOOK/FreeAiBookLandingPage";
import ChatInterface from "./components/ChatInterfaceAi";
import WalletEligibilitySlabs from "./PartnerWeb/CartAmountBasedOrder";
import OurAIVideos from "./FREEAIBOOK/MasterClasses";

import CreateAssistant from "./AskoxyAdmin/Assistants/CreatenewAssistant";
import AssistantDashboard from "./AskoxyAdmin/Assistants/Dashboard";
import AssistantOverview from "./AskoxyAdmin/Assistants/AssistantOverview";
import FaqLLMSlides from "./GenOxy/FaqSildes";
import LLMFAQPage from "./GenOxy/FaqLLM";
import AiVideosGenerated from "./FREEAIBOOK/AiVideosGenerated";

import AllAgentsPage from "./AgentStore/AllAgentsPage";
import AssistantDetails from "./BharathAIStore/pages/AssistantDetails";
import ChatInterface1 from "./BharathAIStore/pages/ChatInterface";
import AiResources from "./BharathAIStore/pages/AIResources";
import AppRoutes from "./BharathAIStore/routes/Landingpage";
import Layout from "./BharathAIStore/routes/Landingpage";
import BharatAgentsStore from "./BharathAIStore/pages/BharatAgentsStore";
import BananaImageGenerate from "./AgentStore/BananaImageGenerate";
import InsuranceAgentsPage from "./BharathAIStore/pages/InsuranceAgentsPage";
import AwardsRewardsVideo from "./BharathAIStore/pages/AwardsRewardsVideo";
import CartCaCsService from "./components/CartCaCsService";
import ServiceCAList from "./components/ServiceCAList";
import ServiceDashboard from "./components/ServiceDashboard";
import EmployeeInteractions from "./Taskmanagement/EmployeeInstructions";
import EmployeeViewChat from "./Taskmanagement/EmployeeChatView";
import HealthcareAgentsPage from "./BharathAIStore/pages/Healthcareagents";
import RemoveTrailingSlash from "./auth/RemoveTrailingSlash";
import AdminMyAgentsPage from "./BharathAIStore/pages/AdminMyAgentsPage";
import RadhaHiddenAgents from "./BharathAIStore/pages/RadhaHiddenAgents";
import AdminTasks from "./Taskmanagement/AdminTasks";
import AllKukatpallyDataPage from "./AskoxyAdmin/kukatapallyData";
import ChatBasedAgent from "./BharathAIStore/pages/chatbasedAgent";
import AgentEntryPage from "./BharathAIStore/pages/AgentEntryPage";
import WeAreHiringAdd from "./AskoxyAdmin/WeAreHiringAdd";
import AdvocatesDataPage from "./AskoxyAdmin/Advoatedata";
import HiringPages from "./Dashboard/hiringpages";
import KukatpallyAssignedDataPage from "./AskoxyAdmin/KukatapallyAssignedData";
import CelebShieldPage from "./components/celebshieldpage";
import QuickAgentCreate from "./BharathAIStore/pages/Agentcreation";
import TestStore from "./BharathAIStore/pages/TestStore";
import TestAgentDetails from "./BharathAIStore/pages/TestAgentDetails";
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
      "/los",
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
      "/studyabroad",
      "/FreeAIBook",
      "/genoxyai-services",
      "/bharath-aistore",
    ];
    if (validEntryPoints.includes(location.pathname)) {
      console.log("Setting entryPoint:", location.pathname); // Debug log
      localStorage.setItem("entryPoint", location.pathname);
    }
  }, [location.pathname]);
  return (
    <CartProvider>
      <SearchProvider>
        <RemoveTrailingSlash />
        <ScrollToTop />
        <div className="App">
          <Routes>
            <Route path="/shopretail" element={<HomePage />} />
            <Route path="/shop-form" element={<ShopFormPage />} />
            <Route path="/shop-list" element={<ShopListPage />} />
            <Route path="/shop-edit/:id" element={<ShopEditForm />} />
            <Route path="/carnival-form" element={<CarnivalFormPage />} />
            <Route path="/carnival-list" element={<CarnivalListPage />} />
            <Route path="/carnivals/edit/:id" element={<CarnivalEditPage />} />
            <Route path="/ThefanofOG" element={<BananaImageGenerate />} />
            {/* ----------------------------- */}
            <Route path="dashboard/:tab" element={<DashboardMain />} />
            {/* <Route path="services/freerudraksha" element={<Freerudraksha />} /> */}
            <Route path="services/freeai-genai" element={<FreeAiandGenAi />} />
            <Route path="services/:id/:type" element={<CampaignDetails />} />
            <Route path="blog/:id/:type" element={<BlogDetails />} />
            <Route path="jobdetails" element={<JobDetails />} />
            <Route path="caserviceitems" element={<CAServicesItems />} />
            <Route path="metroLogin" element={<MetroLogin />} />
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
            {/* <Route path="/studyabroad" element={<StudyAbroad />} /> */}
            <Route path="/whatsapplogin" element={<WhatsappLogin />} />
            <Route path="/whatsappregister" element={<WhatsappRegister />} />
            <Route path="/freerice" element={<FreeRiceBlog />} />
            <Route path="/userFeedback" element={<Feedback />} />
            <Route path="/miyapurmetro" element={<MeyaporeMetro />} />
            <Route path="/aiassistant" element={<ChatInterface />} />
            <Route
              path="/usermobilenumberupdate"
              element={<MobileNumberUpdate />}
            />
            <Route path="/userregister" element={<UserRegister />} />
            {/* <Route path="/glmshome" element={<UseCases />} /> */}
            <Route element={<Layout />}>
              <Route path="/bharath-aistore" element={<BharatAgentsStore />} />
              <Route
                path="/bharath-aistore/insurance"
                element={<InsuranceAgentsPage />}
              />
              <Route
                path="/bharath-aistore/RadhaAgents"
                element={<AdminMyAgentsPage />}
              />
              <Route
                path="/bharath-aistore/hiddenagents"
                element={<RadhaHiddenAgents />}
              />
              <Route
                path="/bharath-aistore/healthcare"
                element={<HealthcareAgentsPage />}
              />
              <Route path="/awards-rewards" element={<AwardsRewardsVideo />} />
              <Route
                path="/bharath-aistore/ai-initiatives"
                element={<AiResources />}
              />
            </Route>
            <Route path="/jobstreet" element={<JobStreet />} />
            <Route
              path="/bharath-aistore/assistant/:id/:agentId"
              element={<AssistantDetails />}
            />
            <Route path="/myblogs" element={<BlogsPage />} />
            <Route path="/wearehiring" element={<HiringPages />} />
            <Route path="/myservices" element={<ServicesPage />} />
            <Route path="/celebshield" element={<CelebShieldPage />} />
            <Route
              path="/termsandconditions"
              element={<TermsAndConditions />}
            />
            <Route path="/rcsconsentform" element={<RCSConsentForm />} />
            <Route
              path="/loanmanagement"
              element={<LoanManagementLandingPage />}
            />
            <Route path="/los" element={<CASDashboard />} />
            <Route
              path="/los/:useCaseId/:type"
              element={<CASRouteRenderer />}
            />
            <Route path="/ai-masterclasses" element={<OurAIVideos />} />
            <Route path="/ai-videos" element={<AiVideosGenerated />} />
            <Route path="/genoxyai-services" element={<LandingPage1 />} />
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
            <Route path="/freeaibook" element={<Content2 />}>
              <Route index element={<FreeAiBookLandingPage />} />
              <Route
                path="view"
                element={
                  <ProtectedRoute>
                    <FreeAiBook />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route
              path="/aiblockchainanditservices"
              element={<AIBlockchainAndItServices />}
            />
            <Route path="/insurancevoice" element={<InsuranceLLmVoice />} />
            <Route path="/genoxy" element={<GenOxy />} />
            <Route
              path="/genoxy/tie"
              element={<Navigate to="/genoxy/chat?a=tie-llm" replace />}
            />
            <Route
              path="/genoxy/klm"
              element={
                <Navigate
                  to={
                    "/genoxy/chat?a=" + encodeURIComponent("klm-fashions LLM")
                  }
                  replace
                />
              }
            />
            {/* Added: New route for chat interface */}
            <Route path="/genoxy/chat" element={<GenOxy />} />
            <Route path="/genoxy/llm-faqs" element={<LLMFAQPage />} />
            <Route path="/genoxy/faqslide" element={<FaqLLMSlides />} />
            <Route
              path="/voiceAssistant"
              element={<Navigate to="/voiceAssistant/welcome" replace />}
            />
            <Route path="/voiceAssistant/:screen" element={<RealtimePage />} />
            <Route path="/caandcsservices" element={<CACSService />} />
            <Route
              path="/visavoice"
              element={<Navigate to="/visavoice/welcome" replace />}
            />
            <Route path="/visavoice/:screen" element={<VisaVoice />} />
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
            <Route
              path="/userinstructionsview"
              element={<EmployeeInteractions />}
            />
            <Route
              path="/taskmanagement/chatview/:id"
              element={<EmployeeViewChat />}
            />
            <Route path="/taskupdated" element={<TaskUpdate />} />
            <Route path="/leaveapproval" element={<LeaveApplicationPage />} />
            <Route path="/leavestatus" element={<TeamLeaveStatus />} />
            <Route path="/all-statuses" element={<AllStatusPage />} />
            <Route path="/assigned-task" element={<AdminTasks />} />
            <Route path="/taskassigneduser" element={<TaskAssignedUser />} />
            <Route path="/hiddenlogin" element={<HiddenLogin />} />
            <Route path="/forgot" element={<ForgotPasswordPage />} />
            <Route path="/contactus" element={<ContactUs />} />
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
            {/* <Route path="/course" element={<CoursesPage />} /> */}
            {/* <Route
              path="/communities/maruthielite"
              element={<RiceSalePage />}
            /> */}
            <Route path="/qrcode" element={<QR />} />
            {/* <Route path="/verify-agent" element={<VerifyIdentity />} /> */}
            {/* <Route path="/bharat-agent" element={<CreateAgentStep1 />} /> */}
            <Route
              path="/bharat-agentbusiness"
              element={<CreateAgentStep2 />}
            />
            {/* <Route path="/bharat-agentprocess" element={<AgentProcess />} /> */}
            {/* <Route path="/bharat-targetcus" element={<AgentTarget />} />
            <Route path="/bharat-contact" element={<AgentContact />} />
            <Route path="/bharat-generate" element={<AgentGenerate />} /> */}
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
            <Route path="/teststore" element={<TestStore />} />
            <Route
              path="/teststore/assistant/:id/:agentId"
              element={<TestAgentDetails />}
            />
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
              <Route path="dashboard/myservices" element={<ServicesPage />} />
              <Route path="dashboard/myblogs" element={<BlogsPage />} />
              <Route path="jobdetails" element={<JobDetails />} />
              <Route path="caserviceitems" element={<CAServicesItems />} />
              <Route path="cartcaservice" element={<CartCaCsService />} />
              <Route path="servicecalist" element={<ServiceCAList />} />
              <Route path="servicedashboard" element={<ServiceDashboard />} />
              {/* <Route path="services/freerudraksha" element={<FreeRudrakshaPage/>} /> */}
              {/* <Route
                path="services/freerudraksha"
                element={<Freerudraksha />}
              /> */}
              <Route
                path="services/freeai-genai"
                element={<FreeAiandGenAi />}
              />
              {/* <Route
                path="services/campaign/:type"
                element={<CampaignDetails />}
              /> */}
              <Route path="services/:id/:type" element={<CampaignDetails />} />
              <Route path="blog/:id/:type" element={<BlogDetails />} />
              <Route path="addblogs" element={<AddBlog />} />
              {/* <Route path="/studyabroad" element={<StudyAbroad />} /> */}
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
              <Route
                path="bharath-aistore/agents"
                element={<AllAgentsPage />}
              />
              <Route path="create-aiagent" element={<CreateAgentWizard />} />
              <Route path="bharat-expert" element={<CreateAgentMain />} />
              {/* <Route path="createagent" element={<AgentEntryPage />} /> */}
              <Route path="agentcreate" element={<QuickAgentCreate />} />
              <Route path="chatbasedagent" element={<ChatBasedAgent />} />
              <Route
                path="chatinterface/assistant/:id/:agentId"
                element={<ChatInterface1 />}
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
              <Route path="addvehicle" element={<VehicleManagement />} />
              <Route path="dbList" element={<DeliveryBoyList />} />
              <Route path="queryManagement" element={<AllQueries />} />
              <Route path="marketreport" element={<MarketReport />} />
              <Route path="scan-qr" element={<BarcodeScanner />} />
              <Route path="itemsList" element={<PartnerItemsList />} />
              <Route path="dbOrderList" element={<DbOrderDetails />} />
              <Route path="feedback" element={<FeedbackDashboard />} />
              <Route path="exchangeorders" element={<ExchangeOrdersPage />} />
              <Route path="orderReport" element={<OrderReport />} />
              <Route path="orderstats" element={<OrderStatsDashboard />} />
              <Route path="updatestock" element={<StockUpdate />} />
              <Route path="versionUpdate" element={<VersionUpdate />} />
              <Route path="updateoffers" element={<OfferImagesUpdate />} />
              <Route path="addReference" element={<AddReference />} />
              <Route path="stockdetails" element={<StockTable />} />
              <Route
                path="cartamountbasedorderplaces"
                element={<WalletEligibilitySlabs />}
              />
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
              <Route path="kukatpally" element={<AllKukatpallyDataPage />} />
              <Route path="wearehiringadd" element={<WeAreHiringAdd />} />
              <Route path="advocates" element={<AdvocatesDataPage />} />
              <Route path="assignedData" element={<AssignedDataPage />} />
              <Route
                path="kukatpallyassignedData"
                element={<KukatpallyAssignedDataPage />}
              />
              <Route path="addjobs" element={<AddJob />} />
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
              <Route path="alljobdetails" element={<JobsAdminPage />} />
              <Route path="userAppliedJobs" element={<UserAppliedJob />} />
              <Route path="assistants" element={<AssistantDashboard />} />
              <Route
                path="conversation/:assistantId"
                element={<AssistantOverview />}
              />
              <Route path="createassistant" element={<CreateAssistant />} />
            </Route>
            {/* ----------Admin Routes end---------- */}
          </Routes>
        </div>
      </SearchProvider>
    </CartProvider>
  );
};

export default App;
