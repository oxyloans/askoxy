import React, { useEffect, Suspense, lazy } from "react";

import { Route, useLocation, Routes, Navigate } from "react-router-dom";
import CartProvider from "./until/CartProvider";
import { useGtagPageView } from "./Pages/Auth/useGtagPageView";
import { SearchProvider } from "./until/SearchContext";
const Landingpage = lazy(() => import("./components/Landingpage"));
// const Freerudraksha = lazy(() => import("./components/Services/Freerudraksh"));
const TermsAndConditions = lazy(() => import("./kart/TermsAndConditions"));
const RCSConsentForm = lazy(() => import("./kart/RCSConsentForm"));
const FreeSample = lazy(() => import("./components/Services/FreeSample"));
const FreeAiandGenAi = lazy(() => import("./components/Services/FreeAi&GenAi"));

const MachinesManufacturingServices = lazy(
  () => import("./components/Services/Machines&ManufacturingService")
);
const LegalService = lazy(() => import("./components/Services/LegalService"));
const MyRotaryServices = lazy(() => import("./components/Services/MyRotary"));
const HiringService = lazy(() => import("./components/Services/HiringService"));
const DesignTemplatesPage = lazy(() => import("./Templates/Templatehome"));
const CAServicesItems = lazy(() => import("./components/CAServicesItems"));
const UniversityPromoCard = lazy(
  () => import("./Templates/UniversityPromoCard")
);
const PromoCard = lazy(() => import("./Templates/PromoCard"));
const RiceOfferFAQs = lazy(() => import("./Dashboard/Faqs"));
const MyCrypto = lazy(() => import("./Dashboard/MyCrypto"));
const LoanManagementLandingPage = lazy(
  () => import("./components/LoanManagementLandingPage")
);
const AdminSidebar = lazy(() => import("./AskoxyAdmin/Sider"));
const Home = lazy(() => import("./Dashboard/Home"));
const CampaignsAdd = lazy(() => import("./AskoxyAdmin/CampaignsAdd"));
const AllCampaignsDetails = lazy(
  () => import("./AskoxyAdmin/AllCampaignDetail")
);
const ForgotPasswordPage = lazy(() => import("./Pages/Auth/Forgotpage"));

const InsuranceLLmVoice = lazy(
  () => import("./GenOxy/components/InsuranceLLMVoice")
);
const ScrollToTop = lazy(() => import("./components/ScrollToTop"));

const AccomidationGpt = lazy(() => import("./components/GPT's/Accomadation"));
const ApplicationSupport = lazy(
  () => import("./components/GPT's/ApplicationSupport")
);
const AccreditationsRecognization = lazy(
  () => import("./components/GPT's/AccreditationsRecognization")
);
const CoursesGpt = lazy(() => import("./components/GPT's/CoursesGpt"));
const PreparationGpt = lazy(() => import("./components/GPT's/PreparationGpt"));
const ForeignExchange = lazy(
  () => import("./components/GPT's/ForeignExchange")
);
const InformationAboutCountries = lazy(
  () => import("./components/GPT's/InformationAboutCountries")
);
const LoansGpt = lazy(() => import("./components/GPT's/LoansGpt"));
const LogisticsGpt = lazy(() => import("./components/GPT's/LogisticsGpt"));
const PlacementsGpt = lazy(() => import("./components/GPT's/PlacementsGpt"));
const QualificationSpecializationGPT = lazy(
  () => import("./components/GPT's/QualificationSpecializationGPT")
);
const VisaGpt = lazy(() => import("./components/GPT's/VisaGpt"));
const ReviewsGpt = lazy(() => import("./components/GPT's/ReviewsGpt"));
const ScholarshipGpt = lazy(() => import("./components/GPT's/ScholarshipGpt"));
const UniversityAgents = lazy(
  () => import("./components/GPT's/UniversityAgents")
);
const University = lazy(() => import("./components/GPT's/UniversityGpt"));
// const RiceSalePage = lazy(() => import("./components/Communities"));
const Admin = lazy(() => import("./AskoxyAdmin/Admin"));
const Climatecrisis = lazy(() => import("./components/Climatecrisis"));
const QR = lazy(() => import("./components/qr"));
const ThankYouPage = lazy(() => import("./components/ThankYouPage"));

const WhatsappLogin = lazy(() => import("./Pages/Auth/WhatsappLogin"));
const WhatsappRegister = lazy(() => import("./Pages/Auth/WhatsappRegister"));
const AllQueries = lazy(() => import("./AskoxyAdmin/AllQueries"));
const RequireAuth = lazy(() => import("./auth/RequireAuth"));
const ItemDisplayPage = lazy(() => import("./kart/itemsdisplay"));
const MyWalletPage = lazy(() => import("./kart/Wallet"));
const CartPage = lazy(() => import("./kart/Cart"));
const MyOrders = lazy(() => import("./kart/Myorders"));
const ProfilePage = lazy(() => import("./kart/Profile"));
const BlogsPage = lazy(() => import("./Dashboard/BlogPage"));
const ServicesPage = lazy(() => import("./Dashboard/ServicesPage"));
const SubscriptionPage = lazy(() => import("./kart/Subscription"));
const WriteToUs = lazy(() => import("./kart/Writetous"));
const TicketHistoryPage = lazy(() => import("./kart/Tickethistory"));
const ManageAddressesPage = lazy(() => import("./kart/Address"));
const CheckoutPage = lazy(() => import("./kart/Checkout"));
const PrivacyPolicy = lazy(() => import("./kart/Privacypolicy"));
const ReferralPage = lazy(() => import("./kart/Referral"));
const DashboardMain = lazy(() => import("./Dashboard/Dashboardmain"));
const BMVPDF = lazy(() => import("./components/bmvpdf"));
const FreeChatGPTmain = lazy(() => import("./Dashboard/FreechatGPTmain"));
const BMVCOINmain = lazy(() => import("./Dashboard/BMVcoinmain"));
const Content1 = lazy(() => import("./Dashboard/Content"));
const CampaignDetails = lazy(() => import("./components/campaignDetails"));
const FreeChatGPTnormal = lazy(() => import("./Dashboard/Freechatgptnormal"));
const WomensDay = lazy(() => import("./components/WomensDay"));
const Content2 = lazy(() => import("./FREEAIBOOK/Content"));
const HiddenLogin = lazy(() => import("./Pages/Auth/HiddenLogin"));
const SuperAdminComments = lazy(
  () => import("./AskoxyAdmin/SuperAdminComments")
);
const TestimonialsPage = lazy(() => import("./Dashboard/TestimoinalsOXY"));
const RiceComparison = lazy(() => import("./components/SteanRiceVsRawRice"));
const RegisteredUser = lazy(() => import("./AskoxyAdmin/RegisteredUser"));
const Login = lazy(() => import("./AskoxyAdmin/Login"));
const RiceGpt = lazy(() => import("./components/RiceGpt"));
const OxyGroup = lazy(() => import("./components/OxygroupPdf"));
const BarcodeScanner = lazy(() => import("./Dashboard/BarcodeScanner"));
const FREEAIANDGENAI = lazy(() => import("./components/AIandGenAi"));
const OxyLoans = lazy(() => import("./components/Services/OxyLoans"));
const UniversityOffers = lazy(() => import("./Dashboard/Offerletter"));
const PinkFunding = lazy(() => import("./components/PinkFunding"));
const CurrentLandingPage = lazy(() => import("./components/CurrentLandinPage"));
const PlanOfTheDay = lazy(() => import("./Taskmanagement/PlanOfTheDay"));

const AllStatusPage = lazy(() => import("./Taskmanagement/AllStatus"));
const AssignedTasksPage = lazy(() => import("./Taskmanagement/AssignedTasks"));

const TaskAssignedUser = lazy(
  () => import("./Taskmanagement/TaskAssignedUser")
);
const TaskUpdate = lazy(() => import("./Taskmanagement/EndoftheDay"));
const UserRegister = lazy(() => import("./Taskmanagement/UserRegister"));
const UserLogin = lazy(() => import("./Taskmanagement/UserLogin"));
const CallerHistoryPage = lazy(
  () => import("./AskoxyAdmin/HelpdeskTodayCalls")
);
// *************************PARTNER START****************************//

const PartnerLogin = lazy(() => import("./PartnerWeb/PartnerLogin"));
const PartnerHome = lazy(() => import("./PartnerWeb/PartnerHome"));
const MainPage = lazy(() => import("./PartnerWeb/MainPage"));
const NewOrders = lazy(() => import("./PartnerWeb/NewOrders"));
const VehicleManagement = lazy(() => import("./PartnerWeb/Addvechicle"));
const OrderDetailsPage = lazy(() => import("./PartnerWeb/OrderDetials"));
const AllOrders = lazy(() => import("./PartnerWeb/AllOrders"));
const DeliveryBoyList = lazy(() => import("./PartnerWeb/DeliveryBoyList"));
const PartnerItemsList = lazy(() => import("./PartnerWeb/PartnerItemsList"));
const DbOrderDetails = lazy(() => import("./PartnerWeb/DbOrderList"));
const AddBlog = lazy(() => import("./AskoxyAdmin/AddBlog"));
const OrderStatsDashboard = lazy(() => import("./AskoxyAdmin/Stats"));
const StockUpdate = lazy(() => import("./AskoxyAdmin/Stockupdate"));
const ContactUs = lazy(() => import("./kart/ContactUs"));
const Register = lazy(() => import("./AskoxyAdmin/Register"));
const AssignedDataPage = lazy(() => import("./AskoxyAdmin/AssignedData"));
const HelpDeskUsersDashboard = lazy(
  () => import("./AskoxyAdmin/HelpDeskUsers")
);
const DataAssigned = lazy(() => import("./AskoxyAdmin/AskoxyUsers"));
const ReferredData = lazy(() => import("./AskoxyAdmin/RefferedData"));
const ProtectedRoute = lazy(() => import("./auth/ProtectedRoute"));
const FreeRiceBlog = lazy(() => import("./components/FreeRice"));
const MeyaporeMetro = lazy(() => import("./components/MeyaporeMetro"));
// const { SearchProvider } = lazy(() => import("./until/SearchContext"));
const SearchMain = lazy(() => import("./Dashboard/SearchMain"));
const OrderReport = lazy(() => import("./AskoxyAdmin/OrderReport"));
const LeaveApplicationPage = lazy(
  () => import("./Taskmanagement/LeaveApplicationPage")
);
const TeamLeaveStatus = lazy(() => import("./Taskmanagement/TeamLeaveStatus"));
const FeedbackDashboard = lazy(() => import("./AskoxyAdmin/FeedBack"));
const MobileNumberUpdate = lazy(
  () => import("./Taskmanagement/EmployeeProfilePage")
);
const HelpDeskDashboard = lazy(() => import("./AskoxyAdmin/HelpDeskDashboard"));
const ExchangeOrdersPage = lazy(() => import("./PartnerWeb/ExchangeOrders"));
const GSTRiceFAQ = lazy(() => import("./components/GstFAQ"));
const LandingPage = lazy(() => import("./GLMS/LandingPage"));
const CASDashboard = lazy(() => import("./GLMS/CAS/Pages/CASDashboard"));
const CASRouteRenderer = lazy(
  () => import("./GLMS/CAS/Pages/CASRouteRenderer")
);
const CMSRouteRenderer = lazy(() => import("./GLMS/CMS/Pages/CMSRoutes"));
const CMSDashboard = lazy(() => import("./GLMS/CMS/Pages/CMSDashboard"));
const FMSDashboard = lazy(() => import("./GLMS/FMS/Pages/FMSDashboard"));
const FMSRouteRenderer = lazy(() => import("./GLMS/FMS/Pages/FMSRoutes"));
const JobStreet = lazy(() => import("./GLMS/JobStreet/JobStreet"));
const OrdersByPincode = lazy(() => import("./AskoxyAdmin/Pincodewiseorders"));
const Feedback = lazy(() => import("./components/Feedback"));

const AIBlockchainAndItServices = lazy(
  () => import("./AIBlockchainAndItSev/AIBlockchainAndItServices")
);
const CACSService = lazy(() => import("./CACSServices/CaCsServices"));
const GoldAndSilverAndDiamond = lazy(
  () => import("./GoldAndSilverAndDiamonds/GoldAndSilverAndDiamonds")
);
const LoansInvestmentsLandingPage = lazy(
  () => import("./LoansInvestments/LoanInvestmentsLandingPage")
);
const RealEstate = lazy(() => import("./Real Estate/Real Estate/RealEstate"));
const Nyayagpt = lazy(() => import("./Nyayagpt/Nyayagpt/Nyayagpt"));
const MetroLogin = lazy(() => import("./Pages/Auth/MetroLogin"));
const Rice2RoboEcommers = lazy(
  () => import("./Rice2RoboEcommers/Rice2RoboEcommers/Rice2RoboEcommers")
);

const HomePage = lazy(() => import("./Retailshop/Pages/Home"));
const ShopFormPage = lazy(() => import("./Retailshop/Pages/ShopFormPage"));
const ShopListPage = lazy(() => import("./Retailshop/Pages/ShopListPage"));
const CarnivalFormPage = lazy(
  () => import("./Retailshop/Pages/CarnivalFormPage")
);
const CarnivalListPage = lazy(
  () => import("./Retailshop/Pages/CarnivalListPage")
);
const ShopEditForm = lazy(() => import("./Retailshop/components/ShopEditForm"));
const CarnivalEditPage = lazy(
  () => import("./Retailshop/Pages/CarnivalEditPage")
);

const CreateAgentMain = lazy(() => import("./AgentStore/CreateAgentMain"));
const CreateAgentStep2 = lazy(() => import("./AgentStore/AgentBusiness"));

const CreateAgentWizard = lazy(() => import("./AgentStore/CreateAgentWizard"));

// *************************STUDY ABRAD****************************//

const UserSelectionPage = lazy(() => import("./StudyAbroad/Homepage"));

const UniversityListPage = lazy(() => import("./StudyAbroad/Universitylist"));
const AllUniversities = lazy(() => import("./StudyAbroad/AllUniversities"));
const LandingPage1 = lazy(() => import("./AIServicesHub/LandingPage"));
const StudyAbroadLandingPage = lazy(
  () => import("./StudyAbroad/StudyAbroadLandingPage")
);
const StudentMainDashboard = lazy(
  () => import("./StudyAbroad/StudentMainDashboard")
);
const BlogDetails = lazy(() => import("./components/BlogDetails"));
const GlobalProgramsPage = lazy(() => import("./StudyAbroad/GlobalProgramsPage"));

const GenOxy = lazy(() => import("./GenOxy/Genoxy"));
const RealtimePage = lazy(
  () => import("./GenOxy/components/RealTimeMainscreen")
);
const VisaVoice = lazy(() => import("./Visavoice/RealTimeMainscreen"));
const JobDetails = lazy(() => import("./components/JobDetails"));
const AddJob = lazy(() => import("./AskoxyAdmin/AddJob"));
const VersionUpdate = lazy(() => import("./PartnerWeb/VersionUpdate"));
const OfferImagesUpdate = lazy(() => import("./PartnerWeb/OfferImagesUpdate"));
const JobsAdminPage = lazy(() => import("./AskoxyAdmin/Alljobdetails"));
const AddReference = lazy(() => import("./PartnerWeb/AddReference"));
const UserAppliedJob = lazy(() => import("./AskoxyAdmin/UserAppliedJobs"));
const StockTable = lazy(() => import("./PartnerWeb/StockDetails"));
const MarketReport = lazy(() => import("./PartnerWeb/Marketreport"));
const FreeAiBookLandingPage = lazy(() => import("./FREEAIBOOK/LandingPage"));
const FreeAiBook = lazy(() => import("./FREEAIBOOK/FreeAiBookLandingPage"));
const ChatInterface = lazy(() => import("./components/ChatInterfaceAi"));
const WalletEligibilitySlabs = lazy(
  () => import("./PartnerWeb/CartAmountBasedOrder")
);
const OurAIVideos = lazy(() => import("./FREEAIBOOK/MasterClasses"));

const CreateAssistant = lazy(
  () => import("./AskoxyAdmin/Assistants/CreatenewAssistant")
);
const AssistantDashboard = lazy(
  () => import("./AskoxyAdmin/Assistants/Dashboard")
);
const AssistantOverview = lazy(
  () => import("./AskoxyAdmin/Assistants/AssistantOverview")
);
const FaqLLMSlides = lazy(() => import("./GenOxy/FaqSildes"));
const LLMFAQPage = lazy(() => import("./GenOxy/FaqLLM"));
const AiVideosGenerated = lazy(() => import("./FREEAIBOOK/AiVideosGenerated"));

const AllAgentsPage = lazy(() => import("./AgentStore/AllAgentsPage"));
const AssistantDetails = lazy(() => import("./BharathAIStore/pages/AssistantDetails"));
const ChatInterface1 = lazy(() => import("./BharathAIStore/pages/ChatInterface"));
const AiResources = lazy(() => import("./BharathAIStore/pages/AIResources"));
const AppRoutes = lazy(() => import("./BharathAIStore/routes/Landingpage"));
const Layout = lazy(() => import("./BharathAIStore/routes/Landingpage"));
const BharatAgentsStore = lazy(() => import("./BharathAIStore/pages/BharatAgentsStore"));
const BananaImageGenerate = lazy(() => import("./AgentStore/BananaImageGenerate"));
const InsuranceAgentsPage = lazy(() => import("./BharathAIStore/pages/InsuranceAgentsPage"));
const AwardsRewardsVideo = lazy(() => import("./BharathAIStore/pages/AwardsRewardsVideo"));
const CartCaCsService = lazy(() => import("./components/CartCaCsService"));
const ServiceCAList = lazy(() => import("./components/ServiceCAList"));
const ServiceDashboard = lazy(() => import("./components/ServiceDashboard"));
const EmployeeInteractions = lazy(() => import("./Taskmanagement/EmployeeInstructions"));
const EmployeeViewChat = lazy(() => import("./Taskmanagement/EmployeeChatView"));
const HealthcareAgentsPage = lazy(() => import("./BharathAIStore/pages/Healthcareagents"));
const RemoveTrailingSlash = lazy(() => import("./auth/RemoveTrailingSlash"));
const AdminMyAgentsPage = lazy(() => import("./BharathAIStore/pages/AdminMyAgentsPage"));
const RadhaHiddenAgents = lazy(() => import("./BharathAIStore/pages/RadhaHiddenAgents"));
const AdminTasks = lazy(() => import("./Taskmanagement/AdminTasks"));
const AllKukatpallyDataPage = lazy(() => import("./AskoxyAdmin/kukatapallyData"));
const ChatBasedAgent = lazy(() => import("./BharathAIStore/pages/chatbasedAgent"));
const AgentEntryPage = lazy(() => import("./BharathAIStore/pages/AgentEntryPage"));
const WeAreHiringAdd = lazy(() => import("./AskoxyAdmin/WeAreHiringAdd"));
const AdvocatesDataPage = lazy(() => import("./AskoxyAdmin/Advoatedata"));
const HiringPages = lazy(() => import("./Dashboard/hiringpages"));
const KukatpallyAssignedDataPage = lazy(() => import("./AskoxyAdmin/KukatapallyAssignedData"));
const CelebShieldPage = lazy(() => import("./components/celebshieldpage"));
const QuickAgentCreate = lazy(() => import("./BharathAIStore/pages/Agentcreation"));
const TestStore = lazy(() => import("./BharathAIStore/pages/TestStore"));
const TestAgentDetails = lazy(() => import("./BharathAIStore/pages/TestAgentDetails"));
const PaymentCashfree = lazy(() => import("./AgentStore/PaymentCashfree"));
const AllAIStore = lazy(() => import("./AIStores/AllAistore"));
const AllAIStores = lazy(() => import("./AIStores/AllAistores"));
const TalwarDataPage = lazy(() => import("./AskoxyAdmin/TalwarData"));
const TalwarAssignedDataPage = lazy(() => import("./AskoxyAdmin/TalwarAssignedDataPage"));
const ApiDocs = lazy(() => import("./components/ApiDocs"));
const InterviewPage = lazy(() => import("./AIMockInterview/interview"));
const BulkInvite = lazy(() => import("./kart/BulkInvite"));
const MumbaiDataPage = lazy(() => import("./AskoxyAdmin/MumbaiDataPage"));
const AgenticAi = lazy(() => import("./components/AgenticAi"));
const AgentStoreManager = lazy(() => import("./components/AistoreCreation"));
const GmailContactsScreen = lazy (()=> import("./kart/GoogleContact"))
// Simple centered loader component
const LoadingSpinner = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f8f9fa', // Light background for better visibility
      fontFamily: 'Arial, sans-serif',
    }}
  >
    <div
      style={{
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #3498db',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        animation: 'spin 1s linear infinite',
        marginBottom: '16px',
      }}
    />
    <div style={{ fontSize: '18px', color: '#333' }}>Loading...</div>
  </div>
);

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
      "/interview",
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
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/shopretail" element={<HomePage />} />
              <Route path="/shop-form" element={<ShopFormPage />} />
              <Route path="/shop-list" element={<ShopListPage />} />
              <Route path="/shop-edit/:id" element={<ShopEditForm />} />
              <Route path="/carnival-form" element={<CarnivalFormPage />} />
              <Route path="/carnival-list" element={<CarnivalListPage />} />
              <Route
                path="/carnivals/edit/:id"
                element={<CarnivalEditPage />}
              />
              <Route path="/ThefanofOG" element={<BananaImageGenerate />} />
              <Route path="/paymentcashfree" element={<PaymentCashfree />} />
              <Route path="/interview" element={<InterviewPage />} />
              {/* ----------------------------- */}
              <Route path="dashboard/:tab" element={<DashboardMain />} />
              {/* <Route path="services/freerudraksha" element={<Freerudraksha />} /> */}
              <Route
                path="services/freeai-genai"
                element={<FreeAiandGenAi />}
              />
              <Route path="services/:id/:type" element={<CampaignDetails />} />
              <Route path="blog/:id/:type" element={<BlogDetails />} />
              <Route path="jobdetails" element={<JobDetails />} />
              <Route path="caserviceitems" element={<CAServicesItems />} />
              <Route path="metroLogin" element={<MetroLogin />} />
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
              {/* ----------------------- */}
              {/* <Route path="/studyabroad" element={<StudyAbroad />} /> */}
              <Route path="/whatsapplogin" element={<WhatsappLogin />} />
              <Route path="/whatsappregister" element={<WhatsappRegister />} />
              <Route path="/freerice" element={<FreeRiceBlog />} />
              <Route
                path="/usercreateaistore"
                element={<AgentStoreManager />}
              />
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
                <Route
                  path="/bharath-aistore"
                  element={<BharatAgentsStore />}
                />
                <Route path="/all-ai-stores" element={<AllAIStores />} />
                <Route path="/ai-store/:storeSlug" element={<AllAIStore />} />
                <Route
                  path="/bharath-aistore/insurance"
                  element={<InsuranceAgentsPage />}
                />
                <Route
                  path="/bharath-aistore/RadhaAgents"
                  element={<AdminMyAgentsPage />}
                />
                <Route path="/all-ai-stores" element={<AllAIStores />} />
                <Route
                  path="/ai-store/:storeSlug/:type"
                  element={<AllAIStore />}
                />
                <Route
                  path="/bharath-aistore/hiddenagents"
                  element={<RadhaHiddenAgents />}
                />
                <Route
                  path="/bharath-aistore/healthcare"
                  element={<HealthcareAgentsPage />}
                />
                <Route
                  path="/awards-rewards"
                  element={<AwardsRewardsVideo />}
                />
                <Route
                  path="/bharath-aistore/ai-initiatives"
                  element={<AiResources />}
                />
              </Route>
              <Route path="/jobstreet" element={<JobStreet />} />
              <Route
                path="/:id/:agentId/:agentname"
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
              <Route
                path="/voiceAssistant/:screen"
                element={<RealtimePage />}
              />
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
              <Route
                path="/rice2roboecommers"
                element={<Rice2RoboEcommers />}
              />
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
              <Route path="/agenticai" element={<AgenticAi />} />
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
              <Route
                path="/freechatgptnormal"
                element={<FreeChatGPTnormal />}
              />
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
              <Route path="/apidocs" element={<ApiDocs />} />
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
                <Route
                  path="/main/dashboard/loans-gpt"
                  element={<LoansGpt />}
                />
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
              <Route path="usercreateaistore" element={<AgentStoreManager />} />
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
                path="bulkinvite"
                element={
                  <RequireAuth>
                    <BulkInvite />
                  </RequireAuth>
                }
              />
              <Route
                path="google"
                element={
                  <RequireAuth>
                    <GmailContactsScreen />
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
                <Route path="talwardata" element={<TalwarDataPage />} />
                <Route path="mumbaidata" element={<MumbaiDataPage />} />
                <Route
                  path="assignedtalwarData"
                  element={<TalwarAssignedDataPage />}
                />
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
          </Suspense>
        </div>
      </SearchProvider>
    </CartProvider>
  );
};

export default App;
