import React, { useEffect, Suspense, lazy } from "react";

import { Route, useLocation, Routes, Navigate } from "react-router-dom";
import CartProvider from "./until/CartProvider";
import { SearchProvider } from "./until/SearchContext";
import { useTokenRefresh } from "./utils/useTokenRefresh";
import { initEnhancedTracking } from "./utils/enhancedTracking";
import { useTaskTokenExpiry } from "./utils/taskTokenManager";
import { initGA, trackPage } from "./utils/analytics";
import { useGtagPageView } from "./Pages/Auth/useGtagPageView";
import SalariedBorrowerChatPage from "./components/SalariedBorrowerChatPage";
import LenderHomePage from "./components/LenderHomepage";
import CallingTeamCallbackRequests from "./AskoxyAdmin/CallingTeamCallbackRequests";
import ATSResumeChecker from "./components/JPL/FreeATSResumeChecker";
import ResumeAnalysisReport from "./components/JPL/ResumeAnalysisReport";
import AwardsRewardsVideo from "./BharathAIStore/pages/AwardsRewardsVideo";

// ─── Previously-eager imports converted to lazy ───────────────────────────────
const AppliedJobs = lazy(() => import("./Dashboard/AppliedJobs"));
const NinetyDayPlanPage = lazy(() => import("./components/NinetyDayPlanPage"));
const CASRouteRenderer1 = lazy(() => import("./GLMS/CAS/Pages/CASRouteRenderer1"));
const FMSRoutes1 = lazy(() => import("./GLMS/FMS/Pages/FMSRoutes1"));
const CMSroutes1 = lazy(() => import("./GLMS/CMS/Pages/CMSroutes1"));
const FreelancerForm = lazy(() => import("./components/FreelancerForm"));
const FloatingCallButton = lazy(() => import("./components/FloatingCallButton"));
const FloatingGiftOffersButton = lazy(() => import("./components/FloatingGiftOffersButton"));
const UserOrdersIntegration = lazy(() => import("./AskoxyAdmin/UserOrdersIntegration"));
const CampaignBlogPage = lazy(() => import("./FREEAIBOOK/CampaignBlogPage"));
const InvoiceGenerator = lazy(() => import("./components/InvoiceGenerator"));
const ChatApp = lazy(() => import("./ChatScreen/ChatApp"));
const VideoCreationPage = lazy(() => import("./BharathAIStore/pages/VideoCreation"));
const GoldRates = lazy(() => import("./components/GoldRates"));
const GoldRatesPage = lazy(() => import("./components/GoldRatesPage"));
const GoldSilverTargets = lazy(() => import("./components/GoldSilverTargets"));
const FreelancersByUserId = lazy(() => import("./components/FreelancersByUserId"));
const DataReading = lazy(() => import("./ChatScreen/DataReading"));
const RotaryPosterStudio = lazy(() => import("./components/DynamicPosterDesignforRotary"));
const RotaryLandingPage = lazy(() => import("./components/RotaryLanding"));
const CandidateDetail = lazy(() => import("./AIMockInterview/admin/CandidateDetail").then(m => ({ default: m.CandidateDetail })));
const ImageCreation = lazy(() => import("./BharathAIStore/pages/ImageCreation"));
const AdminDashboard = lazy(() => import("./AIMockInterview/admin/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const FeedbackForm = lazy(() => import("./AIMockInterview").then(m => ({ default: m.FeedbackForm })));
const MultiLevelSelection = lazy(() => import("./AIMockInterview").then(m => ({ default: m.MultiLevelSelection })));
const ProctoredInterview = lazy(() => import("./AIMockInterview").then(m => ({ default: m.ProctoredInterview })));
const CampaignStats = lazy(() => import("./components/CampaignStatsAccenture"));
const AccentureJobsPage = lazy(() => import("./components/AccentureJobsPage"));
const AccenturePresentation = lazy(() => import("./Dashboard/AccenturePresentation"));
const MinisterMeetingPage = lazy(() => import("./components/MinisterPage"));
const TechmahindraJobsPage = lazy(() => import("./components/TechmahindraJobsPage"));
const AllCompaniesJobsPage = lazy(() => import("./components/AllCompaniesJobsPage"));
const LenderBorrowerPartnerLandingPage = lazy(() => import("./components/LenderPage"));
const GoldLandingPage = lazy(() => import("./components/GoldLandingPage"));
const JPLLandingPage = lazy(() => import("./components/JPL/JPLLandingPage"));
const BroadRidgeJobsPage = lazy(() => import("./components/BroadRidgepage"));
const JobViewPage = lazy(() => import("./components/JobsViewPage"));
const JobAnalysisResult = lazy(() => import("./components/JobAnalysisResult"));
const ExamPage = lazy(() => import("./components/ExamPage"));
const ExamQuestionPage = lazy(() => import("./components/ExamQuestionPage"));
const ExamResultsPage = lazy(() => import("./components/ExamResultsPage"));
const Partnersdasboard = lazy(() => import("./AskoxyAdmin/Freelanceradmin/Partnersdasboard"));
const AdminRequirementList = lazy(() => import("./AskoxyAdmin/Freelanceradmin/AdminRequirementList"));
const AssignedFreelancerAdmin = lazy(() => import("./AskoxyAdmin/Freelanceradmin/AssignedFreelancerslistAdmin"));
const EmployeeProtectedRoutes = lazy(() => import("./auth/EmployeeProtectedRoute"));
const AssignedFreelancersPage = lazy(() => import("./FreelanceMarketplace/AssignedFreelancersPage"));
const FreelancerProfiles = lazy(() => import("./FreelanceMarketplace/FreelancerProfiles"));
const RequirementList = lazy(() => import("./FreelanceMarketplace/RequirementList"));
const EmployeeDashboard = lazy(() => import("./FreelanceMarketplace/EmployeeDashboard"));
const EmployeeLogin = lazy(() => import("./FreelanceMarketplace/EmployeeLogin"));
const EmployeeRegister = lazy(() => import("./FreelanceMarketplace/EmployeeRegister"));
const FinvibeLanding = lazy(() => import("./Finvibe/Landing"));
const Finvide3DLanding = lazy(() => import("./Finvibe/Finvibe3DLanding"));
const FinvibeLayout = lazy(() => import("./Finvibe/FinvibeLayout"));
const FinvibeHomePage = lazy(() => import("./Finvibe/components/HomePage"));
const FinvibeStage1Page = lazy(() => import("./Finvibe/components/Stage1Page"));
const FinvibeStage2Page = lazy(() => import("./Finvibe/components/Stage2Page"));
const FinvibeGenerationPage = lazy(() => import("./Finvibe/components/GenerationPage"));
const OxyGPT = lazy(() => import("./Finvibe/components/Oxyclaude"));
const OxyStreamClaude = lazy(() => import("./Finvibe/OxyStreamClaude"));
const Billing = lazy(() => import("./Finvibe/components/Billing"));
const SendPollBasedRewards = lazy(() => import("./AskoxyAdmin/SendPollBasedRewards"));
const ViewPollBasedRewards = lazy(() => import("./AskoxyAdmin/ViewPollBasedRewards"));
const PlatformRedirect = lazy(() => import("./components/PlatformRedirect"));
const HiringLandingPage = lazy(() => import("./components/HiringLandingPage"));
const WalkInJourneyPage = lazy(() => import("./components/WalkInJourneyPage"));
const DRACertificationLanding = lazy(() => import("./components/DRACertificationLanding"));
const GCCMate = lazy(() => import("./components/GCCMateLandingPage/GCCMate"));
const EmployerJobSeekerPage = lazy(() => import("./components/JPL/EmployerJobSeekerPage"));
const EmployerMentorSection = lazy(() => import("./components/JPL/EmployerMentorSection"));
const RecruitmentKnightRidersPage = lazy(() => import("./components/JPL/RecruitmentKnightRidersPage"));
const RoyalJobSeekersPage = lazy(() => import("./components/JPL/RoyalJobSeekersPage"));
const MarketplaceRaisersPage = lazy(() => import("./components/JPL/MarketplaceRaisersPage"));
const TrainingInstituteGiantsPage = lazy(() => import("./components/JPL/TalentSuperKingsPage"));
const LoginAdmin = lazy(() => import("./AIMockInterview/admin/LoginAdmin"));
const ResumeAIToolsPage = lazy(() => import("./components/JPL/ResumeAIToolsPage"));
const ReferBuddyPage = lazy(() => import("./components/JPL/ReferBuddyPage"));
const ProxyLendPage = lazy(() => import("./components/Services/ProxyLend"));
const RadhAIPage = lazy(() => import("./components/talktoceo/radhai"));
const TalkToCEO = lazy(() => import("./components/talktoceo/TalkToCEO"));
const RadhAIVoicePage = lazy(() => import("./components/talktoceo/RadhAIVoicePage"));
const RadhAICloneAdminPage = lazy(() => import("./components/talktoceo/RadhAICloneAdminPage"));
const SudheerVakkalagadda = lazy(() => import("./AskoxyAdmin/SudheerVakkalagadda"));
const RadhAIRAndDPage = lazy(() => import("./components/talktoceo/RadhAIRAndDPage"));
const RadhAIAdminDashboard = lazy(() => import("./components/talktoceo/RadhAIAdminDashboard"));
const UploadPage = lazy(() => import("./components/EmailCampaign/index").then(m => ({ default: m.UploadPage })));
const SendCampaignPage = lazy(() => import("./components/EmailCampaign/index").then(m => ({ default: m.SendCampaignPage })));
const AllDocumentsPage = lazy(() => import("./components/EmailCampaign/index").then(m => ({ default: m.AllDocumentsPage })));
const AllCampaignsRoute = lazy(() => import("./components/EmailCampaign/index").then(m => ({ default: m.AllCampaignsRoute })));
const ScorecardPage = lazy(() => import("./components/EmailCampaign/index").then(m => ({ default: m.ScorecardPage })));
const ConversationsPage = lazy(() => import("./components/EmailCampaign/index").then(m => ({ default: m.ConversationsPage })));
const GoogleAnalyticsDashboard = lazy(() => import("./components/GoogleAnalyticsDashboard"));
const OxyBricksFractionalPage = lazy(() => import("./components/FractionalPage"));
const Assignedtasksbasedstatus = lazy(() => import("./Taskmanagement/Assignedtasksbasedstatus"));
const EmiratesNBDAIIntelligenceReport2026 = lazy(() => import("./components/EmiratesNBDAIIntelligenceReport2026"));
const FABAIIntelligenceReport2026 = lazy(() => import("./components/FABAIIntelligenceReport2026"));
const ADIBAIIntelligenceReport2026 = lazy(() => import("./components/ADIBAIIntelligenceReport2026"));
const DIBAIIntelligenceReport2026 = lazy(() => import("./components/DIBAIIntelligenceReport2026"));
const Finvibe3DLanding = lazy(() => import("./Finvibe/Finvibe3DLanding"));
const UseCaseEngineDemo = lazy(() => import("./Finvibe/UseCaseEngineDemo"));
const LiveAIDemo = lazy(() => import("./Finvibe/LiveAIDemo"));
const ADCBAIIntelligenceReport2026 = lazy(() => import("./components/ADCBAIIntelligenceReport2026"));
const CBDAIIntelligenceReport2026 = lazy(() => import("./components/CBDAIIntelligenceReport2026"));
const SIBAIIntelligenceReport2026 = lazy(() => import("./components/SIBAIIntelligenceReport2026"));
const MashreqAIIntelligenceReport2026 = lazy(() => import("./components/MashreqAIIntelligenceReport2026"));
const NBFAIIntelligenceReport2026 = lazy(() => import("./components/NBFAIIntelligenceReport2026"));
const RAKBANKAIIntelligenceReport2026 = lazy(() => import("./components/RAKBANKAIIntelligenceReport2026"));
const UAEBanksAIIntelligenceHub = lazy(() => import("./components/UAEBanksAIIntelligenceHub"));
const RadhAIVoicePageCEO = lazy(() => import("./components/talktoceo/RadhAIVoicePageLanguage"));
const CbsDataPage = lazy(() => import("./AskoxyAdmin/CbsDataPage"));
const InternshipPage = lazy(() => import("./StudyAbroad/InternshipPage"));
const BusinessCardLogin = lazy(() => import("./BusinessCard/BusinessCardLogin"));
const BusinessCardRegister = lazy(() => import("./BusinessCard/BusinessCardRegister"));
const BusinessCardProtectedRoute = lazy(() => import("./auth/BusinessCardProtectedRoute"));
const CeoDetailsPage = lazy(() => import("./BusinessCard/CeoDetailsPage"));
const ProcessBusinessCardPage = lazy(() => import("./BusinessCard/ProcessBusinessCardPage"));
const CeoUploadDetailsPage = lazy(() => import("./BusinessCard/CeoUploadDetailsPage"));
const CeoDetailsListPage = lazy(() => import("./BusinessCard/CeoDetailsListPage"));
const AddLeagueJourney = lazy(() => import("./AskoxyAdmin/AddLeagueJourney"));
const BorrowerChatPage = lazy(() => import("./components/BorrowerChatPage"));
const AdminDashboardPage = lazy(() => import("./components/Admindashboardpage"));
const LeagueJourneysAdmin = lazy(() => import("./AskoxyAdmin/LeagueJourneysAdmin"));
const JobTraining90DaysPage = lazy(
  () => import("./Jobplan/jobplanlandingpage"),
);
const Landingpage = lazy(() => import("./components/Landingpage"));
// const Freerudraksha = lazy(() => import("./components/Services/Freerudraksh"));
const TermsAndConditions = lazy(() => import("./kart/TermsAndConditions"));
const RCSConsentForm = lazy(() => import("./kart/RCSConsentForm"));
const FreeSample = lazy(() => import("./components/Services/FreeSample"));
const FreeAiandGenAi = lazy(() => import("./components/Services/FreeAi&GenAi"));

const MachinesManufacturingServices = lazy(
  () => import("./components/Services/Machines&ManufacturingService"),
);
const LegalService = lazy(() => import("./components/Services/LegalService"));
const MyRotaryServices = lazy(() => import("./components/Services/MyRotary"));
const HiringService = lazy(() => import("./components/Services/HiringService"));
const DesignTemplatesPage = lazy(() => import("./Templates/Templatehome"));
const CAServicesItems = lazy(() => import("./components/CAServicesItems"));
const UniversityPromoCard = lazy(
  () => import("./Templates/UniversityPromoCard"),
);
const PromoCard = lazy(() => import("./Templates/PromoCard"));
const RiceOfferFAQs = lazy(() => import("./Dashboard/Faqs"));
const MyCrypto = lazy(() => import("./Dashboard/MyCrypto"));
const LoanManagementLandingPage = lazy(
  () => import("./components/LoanManagementLandingPage"),
);
const OfferScreen = lazy(() => import("./kart/OfferScreen"));
const AdminSidebar = lazy(() => import("./AskoxyAdmin/Sider"));
const Home = lazy(() => import("./Dashboard/Home"));
const CampaignsAdd = lazy(() => import("./AskoxyAdmin/CampaignsAdd"));
const AllCampaignsDetails = lazy(
  () => import("./AskoxyAdmin/AllCampaignDetail"),
);
const ForgotPasswordPage = lazy(() => import("./Pages/Auth/Forgotpage"));

const InsuranceLLmVoice = lazy(
  () => import("./GenOxy/components/InsuranceLLMVoice"),
);

const AccomidationGpt = lazy(() => import("./components/GPT's/Accomadation"));
const ApplicationSupport = lazy(
  () => import("./components/GPT's/ApplicationSupport"),
);
const AccreditationsRecognization = lazy(
  () => import("./components/GPT's/AccreditationsRecognization"),
);
const CoursesGpt = lazy(() => import("./components/GPT's/CoursesGpt"));
const PreparationGpt = lazy(() => import("./components/GPT's/PreparationGpt"));
const ForeignExchange = lazy(
  () => import("./components/GPT's/ForeignExchange"),
);
const InformationAboutCountries = lazy(
  () => import("./components/GPT's/InformationAboutCountries"),
);
const LoansGpt = lazy(() => import("./components/GPT's/LoansGpt"));
const LogisticsGpt = lazy(() => import("./components/GPT's/LogisticsGpt"));
const PlacementsGpt = lazy(() => import("./components/GPT's/PlacementsGpt"));
const QualificationSpecializationGPT = lazy(
  () => import("./components/GPT's/QualificationSpecializationGPT"),
);
const VisaGpt = lazy(() => import("./components/GPT's/VisaGpt"));
const ReviewsGpt = lazy(() => import("./components/GPT's/ReviewsGpt"));
const ScholarshipGpt = lazy(() => import("./components/GPT's/ScholarshipGpt"));
const UniversityAgents = lazy(
  () => import("./components/GPT's/UniversityAgents"),
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
const AgentComboOffersPage = lazy(() => import("./kart/AgentComboOffersPage"));
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
  () => import("./AskoxyAdmin/SuperAdminComments"),
);
const TestimonialsPage = lazy(() => import("./Dashboard/TestimoinalsOXY"));
const RiceComparison = lazy(() => import("./components/SteanRiceVsRawRice"));
const RegisteredUser = lazy(() => import("./AskoxyAdmin/RegisteredUser"));
const RamMohanDarisaAgents = lazy(
  () => import("./AskoxyAdmin/RamMohanDarisaAgents"),
);
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

const TaskAssignedUser = lazy(
  () => import("./Taskmanagement/TaskAssignedUser"),
);
const TaskUpdate = lazy(() => import("./Taskmanagement/EndoftheDay"));
const UserRegister = lazy(() => import("./Taskmanagement/UserRegister"));
const UserLogin = lazy(() => import("./Taskmanagement/UserLogin"));
const CallerHistoryPage = lazy(
  () => import("./AskoxyAdmin/HelpdeskTodayCalls"),
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
  () => import("./AskoxyAdmin/HelpDeskUsers"),
);
const DataAssigned = lazy(() => import("./AskoxyAdmin/AskoxyUsers"));
const ReferredData = lazy(() => import("./AskoxyAdmin/RefferedData"));
const TaskProtectedRoute = lazy(() => import("./auth/TaskProtectedRoute"));
const FreeRiceBlog = lazy(() => import("./components/FreeRice"));
const MeyaporeMetro = lazy(() => import("./components/MeyaporeMetro"));
// const { SearchProvider } = lazy(() => import("./until/SearchContext"));
const SearchMain = lazy(() => import("./Dashboard/SearchMain"));
const OrderReport = lazy(() => import("./AskoxyAdmin/OrderReport"));
const LeaveApplicationPage = lazy(
  () => import("./Taskmanagement/LeaveApplicationPage"),
);
const TeamLeaveStatus = lazy(() => import("./Taskmanagement/TeamLeaveStatus"));
const FeedbackDashboard = lazy(() => import("./AskoxyAdmin/FeedBack"));
const MobileNumberUpdate = lazy(
  () => import("./Taskmanagement/EmployeeProfilePage"),
);
const HelpDeskDashboard = lazy(() => import("./AskoxyAdmin/HelpDeskDashboard"));
const RoleBasedBlogsList = lazy(
  () => import("./AskoxyAdmin/RoleBasedBlogsList"),
);
const AddRoleBasedBlog = lazy(() => import("./AskoxyAdmin/AddRoleBasedBlog"));
const ExchangeOrdersPage = lazy(() => import("./PartnerWeb/ExchangeOrders"));
const GSTRiceFAQ = lazy(() => import("./components/GstFAQ"));
const LandingPage = lazy(() => import("./GLMS/LandingPage"));
const CASDashboard = lazy(() => import("./GLMS/CAS/Pages/CASDashboard"));
const CASRouteRenderer = lazy(
  () => import("./GLMS/CAS/Pages/CASRouteRenderer"),
);
const CMSRouteRenderer = lazy(() => import("./GLMS/CMS/Pages/CMSRoutes"));
const CMSDashboard = lazy(() => import("./GLMS/CMS/Pages/CMSDashboard"));
const FMSDashboard = lazy(() => import("./GLMS/FMS/Pages/FMSDashboard"));
const FMSRouteRenderer = lazy(() => import("./GLMS/FMS/Pages/FMSRoutes"));
const JobStreet = lazy(() => import("./GLMS/JobStreet/JobStreet"));
const OrdersByPincode = lazy(() => import("./AskoxyAdmin/Pincodewiseorders"));
const Feedback = lazy(() => import("./components/Feedback"));

const AIBlockchainAndItServices = lazy(
  () => import("./AIBlockchainAndItSev/AIBlockchainAndItServices"),
);
const CACSService = lazy(() => import("./CACSServices/CaCsServices"));
const GoldAndSilverAndDiamond = lazy(
  () => import("./GoldAndSilverAndDiamonds/GoldAndSilverAndDiamonds"),
);
const LoansInvestmentsLandingPage = lazy(
  () => import("./LoansInvestments/LoanInvestmentsLandingPage"),
);
const RealEstate = lazy(() => import("./Real Estate/RealEstate"));
const Nyayagpt = lazy(() => import("./Nyayagpt/Nyayagpt/Nyayagpt"));
const MetroLogin = lazy(() => import("./Pages/Auth/MetroLogin"));
const Rice2RoboEcommers = lazy(
  () => import("./Rice2RoboEcommers/Rice2RoboEcommers"),
);

const HomePage = lazy(() => import("./Retailshop/Pages/Home"));
const ShopFormPage = lazy(() => import("./Retailshop/Pages/ShopFormPage"));
const ShopListPage = lazy(() => import("./Retailshop/Pages/ShopListPage"));
const CarnivalFormPage = lazy(
  () => import("./Retailshop/Pages/CarnivalFormPage"),
);
const CarnivalListPage = lazy(
  () => import("./Retailshop/Pages/CarnivalListPage"),
);
const ShopEditForm = lazy(() => import("./Retailshop/components/ShopEditForm"));
const CarnivalEditPage = lazy(
  () => import("./Retailshop/Pages/CarnivalEditPage"),
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
  () => import("./StudyAbroad/StudyAbroadLandingPage"),
);
const StudentMainDashboard = lazy(
  () => import("./StudyAbroad/StudentMainDashboard"),
);
const BlogDetails = lazy(() => import("./components/BlogDetails"));

const GenOxy = lazy(() => import("./GenOxy/Genoxy"));
const RealtimePage = lazy(
  () => import("./GenOxy/components/RealTimeMainscreen"),
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

const ChatInterface = lazy(() => import("./components/ChatInterfaceAi"));
const WalletEligibilitySlabs = lazy(
  () => import("./PartnerWeb/CartAmountBasedOrder"),
);
const CreateFromImageText = lazy(
  () => import("./PartnerWeb/CreateFromImageText"),
);
const OurAIVideos = lazy(() => import("./FREEAIBOOK/MasterClasses"));

const CreateAssistant = lazy(
  () => import("./AskoxyAdmin/Assistants/CreatenewAssistant"),
);
const AssistantDashboard = lazy(
  () => import("./AskoxyAdmin/Assistants/Dashboard"),
);
const VectorStorePage = lazy(
  () => import("./AskoxyAdmin/Assistants/VectorStorePage"),
);
const AssistantOverview = lazy(
  () => import("./AskoxyAdmin/Assistants/AssistantOverview"),
);
const FaqLLMSlides = lazy(() => import("./GenOxy/FaqSildes"));
const LLMFAQPage = lazy(() => import("./GenOxy/FaqLLM"));
const AiVideosGenerated = lazy(() => import("./FREEAIBOOK/AiVideosGenerated"));

const AllAgentsPage = lazy(() => import("./AgentStore/AllAgentsPage"));
const AssistantDetails = lazy(
  () => import("./BharathAIStore/pages/AssistantDetails"),
);
const ChatInterface1 = lazy(
  () => import("./BharathAIStore/pages/ChatInterface"),
);
const AiResources = lazy(() => import("./BharathAIStore/pages/AIResources"));

const Layout = lazy(() => import("./BharathAIStore/routes/Landingpage"));
const BharatAgentsStore = lazy(
  () => import("./BharathAIStore/pages/BharatAgentsStore"),
);
const BananaImageGenerate = lazy(
  () => import("./AgentStore/BananaImageGenerate"),
);
const InsuranceAgentsPage = lazy(
  () => import("./BharathAIStore/pages/InsuranceAgentsPage"),
);


const CartCaCsService = lazy(() => import("./components/CartCaCsService"));
const ServiceCAList = lazy(() => import("./components/ServiceCAList"));
const ServiceDashboard = lazy(() => import("./components/ServiceDashboard"));
const EmployeeInteractions = lazy(
  () => import("./Taskmanagement/EmployeeInstructions"),
);
const EmployeeViewChat = lazy(
  () => import("./Taskmanagement/EmployeeChatView"),
);
const HealthcareAgentsPage = lazy(
  () => import("./BharathAIStore/pages/Healthcareagents"),
);
const RemoveTrailingSlash = lazy(() => import("./auth/RemoveTrailingSlash"));
const AdminMyAgentsPage = lazy(
  () => import("./BharathAIStore/pages/AdminMyAgentsPage"),
);
const RadhaHiddenAgents = lazy(
  () => import("./BharathAIStore/pages/RadhaHiddenAgents"),
);
const AdminTasks = lazy(() => import("./Taskmanagement/AdminTasks"));
const AllKukatpallyDataPage = lazy(
  () => import("./AskoxyAdmin/kukatapallyData"),
);
const ChatBasedAgent = lazy(
  () => import("./BharathAIStore/pages/chatbasedAgent"),
);

const WeAreHiringAdd = lazy(() => import("./AskoxyAdmin/WeAreHiringAdd"));
const AdvocatesDataPage = lazy(() => import("./AskoxyAdmin/Advoatedata"));
const HiringPages = lazy(() => import("./Dashboard/hiringpages"));
const LeagueJourneysPage = lazy(() => import("./Dashboard/LeagueJourneysPage"));
const KukatpallyAssignedDataPage = lazy(
  () => import("./AskoxyAdmin/KukatapallyAssignedData"),
);
const CelebShieldPage = lazy(() => import("./components/celebshieldpage"));
const QuickAgentCreate = lazy(
  () => import("./BharathAIStore/pages/Agentcreation"),
);
const TestStore = lazy(() => import("./BharathAIStore/pages/TestStore"));
const TestAgentDetails = lazy(
  () => import("./BharathAIStore/pages/TestAgentDetails"),
);
const PaymentCashfree = lazy(() => import("./AgentStore/PaymentCashfree"));
const AllAIStore = lazy(() => import("./AIStores/AllAistore"));
const AllAIStores = lazy(() => import("./AIStores/AllAistores"));
const TalwarDataPage = lazy(() => import("./AskoxyAdmin/TalwarData"));
const TalwarAssignedDataPage = lazy(
  () => import("./AskoxyAdmin/TalwarAssignedDataPage"),
);
const ApiDocs = lazy(() => import("./components/ApiDocs"));
const InterviewPage = lazy(() => import("./AIMockInterview/interview"));
const BulkInvite = lazy(() => import("./kart/BulkInvite"));
const MumbaiDataPage = lazy(() => import("./AskoxyAdmin/MumbaiDataPage"));
const AgenticAi = lazy(() => import("./components/AgenticAi"));
const AgentStoreManager = lazy(() => import("./components/AistoreCreation"));
const GmailContactsScreen = lazy(() => import("./kart/GoogleContact"));
const AgentCreationSteps = lazy(
  () => import("./components/AgentCreationSteps"),
);
const TripPlanner = lazy(() => import("./AITripPlanner/TripPlanner"));
const TaxInvoice = lazy(() => import("./components/TaxInvoice"));
const AccentureServices = lazy(
  () => import("./components/CampaignStatsAccenture"),
);

// Simple centered loader component
const LoadingSpinner = React.memo(() => {
  React.useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes oxy-pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.08); opacity: 0.85; }
      }
      @keyframes oxy-bar {
        0% { width: 0%; }
        60% { width: 80%; }
        100% { width: 100%; }
      }
      @keyframes oxy-dot {
        0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
        40% { transform: scale(1); opacity: 1; }
      }
      .oxy-logo-wrap {
        animation: oxy-pulse 1.8s ease-in-out infinite;
      }
      .oxy-progress-bar {
        animation: oxy-bar 2s ease-in-out infinite;
      }
      .oxy-dot { animation: oxy-dot 1.2s ease-in-out infinite; }
      .oxy-dot:nth-child(2) { animation-delay: 0.2s; }
      .oxy-dot:nth-child(3) { animation-delay: 0.4s; }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0fdf4 100%)",
        fontFamily: "Arial, sans-serif",
        gap: 0,
      }}
    >
      {/* Card */}
      <div
        style={{
         
          padding: "40px 48px 36px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          minWidth: 280,
        }}
      >
        {/* Logo */}
        <div className="oxy-logo-wrap">
          <img
            src={require("./assets/img/askoxylogonew.png")}
            alt="AskOxy"
            style={{ height: 56, objectFit: "contain", display: "block" }}
          />
        </div>

        {/* Progress bar */}
        <div
          style={{
            width: "100%",
            height: 4,
            background: "#ede9f6",
            borderRadius: 99,
            overflow: "hidden",
          }}
        >
          <div
            className="oxy-progress-bar"
            style={{
              height: "100%",
              background: "linear-gradient(90deg, #5c3391, #1ab394)",
              borderRadius: 99,
            }}
          />
        </div>

       
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          
          <span style={{ fontSize: 14, color: "#6b7280", marginLeft: 6, fontWeight: 500 }}>
            Loading, please wait…
          </span>
        </div>
      </div>
    </div>
  );
});

const App: React.FC = () => {
  const location = useLocation();

  useGtagPageView();

  useTokenRefresh();

  useTaskTokenExpiry();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (
      params.get("utm_source") ||
      params.get("utm_medium") ||
      params.get("utm_campaign")
    ) {
      const utmData = {
        source: params.get("utm_source"),
        medium: params.get("utm_medium"),
        campaign: params.get("utm_campaign"),
        content: params.get("utm_content"),
        term: params.get("utm_term"),
        fullUrl: window.location.href,
        pagePath: window.location.pathname,
      };

      console.log("UTM DATA:", utmData);
      localStorage.setItem("utmData", JSON.stringify(utmData));

      if ((window as any).gtag) {
        (window as any).gtag("event", "utm_landing", {
          page_location: window.location.href,
          page_path: window.location.pathname,
          utm_source: utmData.source,
          utm_medium: utmData.medium,
          utm_campaign: utmData.campaign,
          utm_content: utmData.content,
          utm_term: utmData.term,
        });
      }
    }
  }, []);
  // useEffect(() => {
  //     const rt = getRefreshToken();
  //     if (rt) {
  //       console.log("Refresh token found on app load, attempting refresh...");
  //       // You can trigger an immediate token refresh here if needed
  //     } else {
  //       console.log("No refresh token found on app load.");
  //     }
  //   }, []);

  useEffect(() => {
    initGA();
    const cleanup = initEnhancedTracking();
    return cleanup;
  }, []);

  useEffect(() => {
    trackPage(location.pathname);
  }, [location]);

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
      "/radhai",
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
      "/accenture/jobs",
      "/accenturestats",
      "/techmahindra/jobs",
      "/allcompanies/jobs",
      "/broadridge/jobs",
      "/credera/jobs",
      "/jpl","/fpl","/oxygold",
      "/viewjobdetails/default/ALL",
    ];
    if (validEntryPoints.includes(location.pathname)) {
      console.log("Setting entryPoint:", location.pathname); // Debug log
      localStorage.setItem("entryPoint", location.pathname);
    }
  }, [location.pathname]);
  const isDashboardHomeRoute = location.pathname === "/main/dashboard/home";
  const isRootRoute = location.pathname === "/";
  const isLoggedIn = !!localStorage.getItem("userId");
  const isRestrictedRoute = () => {
    const currentPath = location.pathname;
    return (
      // Login pages
      currentPath === "/admin" ||
      currentPath === "/partnerlogin" ||
      currentPath === "/userlogin" ||
      currentPath === "/employee-login" ||
      currentPath === "/employee-register" ||
      // Employee routes
      currentPath === "/employee-dashboard" ||
      currentPath === "/employee-requirement-list" ||
      currentPath === "/employee-freelancers" ||
      // Employee/Internal routes
      currentPath.startsWith("/userPanelLayout") ||
      currentPath.startsWith("/goldrates") ||
      currentPath.startsWith("/all-different-gold-rates") ||
      currentPath.startsWith("/allgoldrates") ||
      currentPath.startsWith(
        "/employee-freelancers/:companyId/:requirementId",
      ) ||
      currentPath.startsWith("/radha/adcb-ai-intelligence") ||
      currentPath.startsWith("/radha/emirates-nbd-ai-intelligence") ||
      currentPath.startsWith("/radha/fab-ai-intelligence") ||
      currentPath.startsWith("/employee-assigned-freelancers/:companyId") ||
      currentPath.startsWith("/radha/adib-ai-intelligence") ||
      currentPath.startsWith("/radha/dib-ai-intelligence") ||
      currentPath.startsWith("/radha/cbd-ai-intelligence") ||
      currentPath.startsWith("/radha/sib-ai-intelligence") ||
      currentPath.startsWith("/radha/mashreq-ai-intelligence") ||
      currentPath.startsWith("/radha/nbf-ai-intelligence") ||
      currentPath.startsWith("/radha/rakbank-ai-intelligence") ||
      currentPath.startsWith("/smartlock") ||
      currentPath.startsWith("/radha/uae-banks-ai-intelligence") ||
      currentPath.startsWith("/planoftheday") ||
      currentPath.startsWith("/userinstructionsview") ||
      currentPath.startsWith("/taskmanagement") ||
      currentPath.startsWith("/taskupdated") ||
      currentPath.startsWith("/email-campaign") ||
      currentPath.startsWith("/leaveapproval") ||
      currentPath.startsWith("/leavestatus") ||
      currentPath.startsWith("/all-statuses") ||
      currentPath.startsWith("/assigned-task") ||
      currentPath.startsWith("/techmahindra/jobs") ||
      currentPath.startsWith("/allcompanies/jobs") ||
      currentPath.startsWith("/credera/jobs") ||
      currentPath.startsWith("/taskassigneduser") ||
      currentPath.startsWith("/broadridge/jobs") ||
      currentPath.startsWith("/employeeprofile") ||
      // Partner routes
      currentPath.startsWith("/home") ||
      // Admin routes
      currentPath.startsWith("/admin") ||
      currentPath.startsWith("/glms") ||
      currentPath.startsWith("/adminRegister") ||
      currentPath.startsWith("/accenture/jobs") ||
      currentPath.startsWith("/accenturestats") ||
      currentPath.startsWith("/accenture-presentation") ||
      currentPath.startsWith("/interview") ||
      currentPath.startsWith("/oxybfsai-landing") ||
      currentPath.startsWith("/oxybfsai") ||
      currentPath.startsWith("/finvibe-code-builder") ||
      currentPath.startsWith("/insurvibe-code-builder") ||
      currentPath.startsWith("/radhai-admin/") ||
      currentPath.startsWith("/radha/uae-banks-ai-intelligence") ||
      currentPath.startsWith("/radhai-admin") ||
      currentPath.startsWith("/use-case-engine") ||
      currentPath.startsWith("/live-ai-demo") ||
      currentPath.startsWith("/radhai") ||
      currentPath.startsWith("/talktoceo") ||
      currentPath.startsWith("/radhai-connect") ||
      currentPath.startsWith("/radhAI") ||
      currentPath.startsWith("/radhai-admin") ||
      currentPath.startsWith("/generate") ||
      currentPath.startsWith("/generate/:id") ||
      currentPath.startsWith("/stage2/:sessionId") ||
      currentPath.startsWith("/oxygpt/claude")
    );
  };

  return (
    <CartProvider>
      <SearchProvider>
        <RemoveTrailingSlash />

        <Suspense fallback={<LoadingSpinner />}>
          <div className="App">
            {/* {localStorage.getItem("userId") &&
              !isRestrictedRoute() && <FloatingCallButton />}
            {localStorage.getItem("userId") &&
              !isRestrictedRoute() && <FloatingGiftOffersButton />} */}
            {isLoggedIn && isRootRoute && (
              <FloatingCallButton hideOnMobile />
            )}

            {isLoggedIn && isDashboardHomeRoute && (
              <>
                <FloatingCallButton />
                <FloatingGiftOffersButton />
              </>
            )}
            <Routes>
              <Route path="/shopretail" element={<HomePage />} />
              <Route path="/shop-form" element={<ShopFormPage />} />
              <Route path="/shop-list" element={<ShopListPage />} />
              <Route path="/shop-edit/:id" element={<ShopEditForm />} />
              <Route path="/90dayjobplan" element={<JobTraining90DaysPage />} />
              <Route path="/carnival-form" element={<CarnivalFormPage />} />
              <Route path="/carnival-list" element={<CarnivalListPage />} />
              <Route path="/Oxygpt" element={<OxyGPT />} />
              <Route path="/oxygpt/claude" element={<OxyStreamClaude />} />
              <Route path="/loan-application" element={<BorrowerChatPage />} />
              <Route path="/salaried-br-loan-application" element={<SalariedBorrowerChatPage />} />
              <Route path="/application-status" element={<AdminDashboardPage />} />
              
              <Route path="/oxygpt/share/:sessionId" element={<OxyGPT />} />
              <Route path="/finvibe" element={<Finvibe3DLanding />} />
              <Route path="/use-case-engine" element={<UseCaseEngineDemo />} />
              <Route path="/live-ai-demo" element={<LiveAIDemo />} />
              <Route path="/adcb" element={<ADCBAIIntelligenceReport2026 />} />
              <Route path="/oxybfsai" element={<Billing />} />
              <Route path="/oxybfsai-landing" element={<Finvide3DLanding />} />
              <Route path="/finvibe" element={<Finvibe3DLanding />} />
              <Route path="/use-case-engine" element={<UseCaseEngineDemo />} />
              <Route path="/live-ai-demo" element={<LiveAIDemo />} />
              <Route path="/adcb" element={<ADCBAIIntelligenceReport2026 />} />
              <Route path="/oxybfsai" element={<Billing />} />
              <Route path="/oxybfsai-landing" element={<Finvide3DLanding />} />

              {/* OXY BFSAI Engine — full layout with fixed header */}
              <Route element={<FinvibeLayout />}>
                <Route path="/oxybfsai-engine" element={<FinvibeHomePage />} />
                <Route path="/generate" element={<FinvibeStage1Page />} />
                <Route
                  path="/stage2/:sessionId"
                  element={<FinvibeStage2Page />}
                />
                <Route
                  path="/generating/:sessionId"
                  element={<FinvibeGenerationPage />}
                />
              </Route>

              <Route
                path="/finvibe-code-builder"
                element={<FinvibeLanding />}
              />
              <Route
                path="/insurvibe-code-builder"
                element={<FinvibeLanding />}
              />
              <Route path="/login-admin" element={<LoginAdmin />} />
              <Route
                path="/carnivals/edit/:id"
                element={<CarnivalEditPage />}
              />
              {/* <Route path="/freelancers" element={<FreelancerList />} /> */}

              <Route path="/ThefanofOG" element={<BananaImageGenerate />} />

              <Route path="/paymentcashfree" element={<PaymentCashfree />} />
              <Route path="/interview" element={<InterviewPage />} />
              <Route
                path="/admin/candidate/:userId"
                element={<CandidateDetail />}
              />
              <Route
                path="/admin/interviewdashboard"
                element={<AdminDashboard />}
              />
              <Route
                path="/multi-level-select"
                element={<MultiLevelSelection />}
              />
              <Route path="/multi-interview" element={<ProctoredInterview />} />
              <Route path="/feedback" element={<FeedbackForm />} />
              <Route path="/offer" element={<OfferScreen />} />
              <Route path="/tripplanner" element={<TripPlanner />} />
              <Route path="/invoice" element={<InvoiceGenerator />} />
              <Route path="/tax-invoice" element={<TaxInvoice />} />
              <Route path="/chat" element={<ChatApp />} />
              <Route path="/goldrates" element={<GoldRates />} />
              <Route path="/smartlock" element={<GoldSilverTargets />} />
              <Route path="/allgoldrates" element={<GoldRatesPage />} />
              <Route path="/oxyinsurance" element={<DataReading />} />
              <Route
                path="/it-minister-vision"
                element={<MinisterMeetingPage />}
              />
              <Route path="/gccmate" element={<GCCMate />} />
              <Route path="/employers" element={<EmployerJobSeekerPage />} />
              <Route
                path="/radha/uae-banks-ai-intelligence"
                element={<UAEBanksAIIntelligenceHub />}
              />
              <Route path="/radhAI" element={<RadhAIPage />} />
              <Route path="/radhai-connect" element={<RadhAIVoicePage />} />
              <Route path="/ceoclonevoice" element={<RadhAICloneAdminPage />} />

              <Route
                path="/radhai-admin/*"
                element={<RadhAIAdminDashboard />}
              />

              <Route path="/radhai-RandD" element={<RadhAIRAndDPage />} />
              <Route path="/talktoceo" element={<TalkToCEO />} />
              <Route path="/internships" element={<InternshipPage />} />
              <Route
                path="/radhai-assistant"
                element={<RadhAIVoicePageCEO />}
              />
              <Route path="/circleLend" element={<ProxyLendPage />} />
              <Route path="/resume-ai" element={<ResumeAIToolsPage />} />
              <Route path="/mentors" element={<EmployerMentorSection />} />
              <Route path="/refer-buddy" element={<ReferBuddyPage />} />
              <Route path="/job-seekers" element={<RoyalJobSeekersPage />} />
              <Route
                path="/recruitment-knight-riders"
                element={<RecruitmentKnightRidersPage />}
              />
              <Route
                path="/talent-super-kings"
                element={<TrainingInstituteGiantsPage />}
              />
              <Route
                path="/marketplace-raisers"
                element={<MarketplaceRaisersPage />}
              />
              <Route path="/accenturestats" element={<CampaignStats />} />
              <Route path="/accenture/jobs" element={<AccentureJobsPage />} />
              {/* <Route path="/credera/jobs" element={<CrederaJobsPage />} /> */}
              <Route
                path="/techmahindra/jobs"
                element={<TechmahindraJobsPage />}
              />
              <Route path="/broadridge/jobs" element={<BroadRidgeJobsPage />} />
              <Route
                path="/allcompanies/jobs"
                element={<AllCompaniesJobsPage />}
              />
              <Route
                path="/accenture-presentation"
                element={<AccenturePresentation />}
              />
              <Route
                path="/rotarydistrict3150AiAgent"
                element={<RotaryLandingPage />}
              />
              <Route
                path="/accenture-services"
                element={<AccentureServices />}
              />
              <Route
                path="/dynamic-rotaryposter"
                element={<RotaryPosterStudio />}
              />
              <Route
                path="/ninetydayplan"
                element={
                  <RequireAuth>
                    <NinetyDayPlanPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/campaign/:campaignId"
                element={<CampaignBlogPage />}
              />

              {/* NOTE: These are your existing relative routes (kept same) */}
              <Route path="dashboard/:tab" element={<DashboardMain />} />
              <Route
                path="services/freeai-genai"
                element={<FreeAiandGenAi />}
              />
              <Route path="services/:id/:type" element={<CampaignDetails />} />
              <Route path="blog/:id/:type" element={<BlogDetails />} />
              <Route path="jobdetails" element={<JobDetails />} />
              <Route path="viewjobdetails" element={<JobViewPage />} />
              <Route path="viewjobdetails/:id" element={<JobViewPage />} />
              <Route
                path="viewjobdetails/:id/:company"
                element={<JobViewPage />}
              />
              <Route path="caserviceitems" element={<CAServicesItems />} />
              <Route path="metroLogin" element={<MetroLogin />} />
              <Route
                path="agentCreationSteps"
                element={<AgentCreationSteps />}
              />
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

              {/* ===================================================== */}
              {/* ✅ AUTH ROUTES (WhatsApp Login/Register) */}
              {/* ===================================================== */}
              <Route path="/whatsapplogin" element={<WhatsappLogin />} />
              <Route path="/whatsappregister" element={<WhatsappRegister />} />

              {/* ===================================================== */}
              {/* ✅ OTHER PUBLIC ROUTES */}
              {/* ===================================================== */}
              <Route path="/freerice" element={<FreeRiceBlog />} />
              <Route
                path="/usercreateaistore"
                element={<AgentStoreManager />}
              />
              <Route path="/userFeedback" element={<Feedback />} />
              <Route path="/miyapurmetro" element={<MeyaporeMetro />} />
              <Route path="/aiassistant" element={<ChatInterface />} />

              <Route path="/userregister" element={<UserRegister />} />
              <Route path="/userlogin" element={<UserLogin />} />
              {/* ✅ FREELANCE MARKETPLACE ROUTES (EMPLOYEE/COMPANY) */}
              {/* ===================================================== */}
              <Route path="/employee-login" element={<EmployeeLogin />} />
              <Route path="/employee-register" element={<EmployeeRegister />} />
              <Route
                path="/employee-dashboard"
                element={
                  <EmployeeProtectedRoutes>
                    <EmployeeDashboard />
                  </EmployeeProtectedRoutes>
                }
              />
              <Route
                path="/employee-requirement-list"
                element={
                  <EmployeeProtectedRoutes>
                    <RequirementList />
                  </EmployeeProtectedRoutes>
                }
              />
              <Route
                path="/employee-freelancers/:companyId/:requirementId"
                element={
                  <EmployeeProtectedRoutes>
                    <FreelancerProfiles />
                  </EmployeeProtectedRoutes>
                }
              />
              <Route
                path="/employee-assigned-freelancers/:companyId"
                element={
                  <EmployeeProtectedRoutes>
                    <AssignedFreelancersPage />
                  </EmployeeProtectedRoutes>
                }
              />
              {/* ===================================================== */}
              {/* ✅ PUBLIC PAGES UNDER LAYOUT */}
              {/* ===================================================== */}
              <Route element={<Layout />}>
                <Route
                  path="/bharath-aistore"
                  element={<BharatAgentsStore />}
                />
                <Route path="/all-ai-stores" element={<AllAIStores />} />
                <Route path="/ai-store/:storeSlug" element={<AllAIStore />} />
                <Route
                  path="/ai-store/:storeSlug/:type"
                  element={<AllAIStore />}
                />
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
                <Route
                  path="/awards-rewards"
                  element={<AwardsRewardsVideo />}
                />
                <Route
                  path="/bharath-aistore/ai-initiatives"
                  element={<AiResources />}
                />
              </Route>
              <Route path="/image-creator" element={<ImageCreation />} />
              <Route path="/video-creator" element={<VideoCreationPage />} />

              {/* ✅ MORE PUBLIC ROUTES */}

              <Route path="/jobstreet" element={<JobStreet />} />
              <Route
                path="/:id/:agentId/:agentname"
                element={<AssistantDetails />}
              />
              <Route path="/myblogs" element={<BlogsPage />} />
              <Route path="/wearehiring" element={<HiringPages />} />
              <Route path="/leaguejourneys" element={<LeagueJourneysPage />} />
              <Route path="/myservices" element={<ServicesPage />} />
              <Route path="/celebshield" element={<CelebShieldPage />} />
              <Route
                path="/termsandconditions"
                element={<TermsAndConditions />}
              />
              <Route
                path="/loansandinvest"
                element={<LenderBorrowerPartnerLandingPage />}
              />
              <Route path="/oxygold" element={<GoldLandingPage />} />
              <Route path="/jpl" element={<JPLLandingPage />} />
              <Route path="/fpl" element={<OxyBricksFractionalPage />} />

              <Route path="/rcsconsentform" element={<RCSConsentForm />} />
              <Route
                path="/loanmanagement"
                element={<LoanManagementLandingPage />}
              />
              <Route path="/platform-redirect" element={<PlatformRedirect />} />

              {/* LOS / Dashboards */}
              <Route path="/los" element={<CASDashboard />} />
              <Route
                path="/los/:useCaseId/:type"
                element={<CASRouteRenderer />}
              />
              <Route
                path="/lo-system/:useCaseId/:type"
                element={<CASRouteRenderer1 />}
              />
              <Route
                path="/fm-system/:useCaseId/:type"
                element={<FMSRoutes1 />}
              />
              <Route
                path="/cm-system/:useCaseId/:type"
                element={<CMSroutes1 />}
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

              {/* AI Videos / Content */}
              <Route path="/ai-masterclasses" element={<OurAIVideos />} />
              <Route path="/ai-videos" element={<AiVideosGenerated />} />
              <Route path="/genoxyai-services" element={<LandingPage1 />} />

              {/* Free AI Book */}
              <Route path="/freeaibook" element={<Content2 />}>
                <Route index element={<FreeAiBookLandingPage />} />
                {/* <Route
                  path="view"
                  element={
                    <ProtectedRoute>
                      <FreeAiBook />
                    </ProtectedRoute>
                  }
                /> */}
              </Route>
              {/* GenOxy */}
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
              <Route path="/genoxy/chat" element={<GenOxy />} />
              <Route path="/genoxy/llm-faqs" element={<LLMFAQPage />} />
              <Route path="/genoxy/faqslide" element={<FaqLLMSlides />} />

              {/* Voice Assistants */}
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

              {/* Other Landing / Service pages */}
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
              <Route
                path="/business-card/login"
                element={<BusinessCardLogin />}
              />
              <Route
                path="/business-card/register"
                element={<BusinessCardRegister />}
              />
              <Route
                path="/business-card/ceo-details"
                element={
                  <BusinessCardProtectedRoute>
                    <CeoDetailsPage />
                  </BusinessCardProtectedRoute>
                }
              />
              <Route
                path="/business-card/process"
                element={
                  <BusinessCardProtectedRoute>
                    <ProcessBusinessCardPage />
                  </BusinessCardProtectedRoute>
                }
              />
              <Route
                path="/business-card/upload-details"
                element={
                  <BusinessCardProtectedRoute>
                    <CeoUploadDetailsPage />
                  </BusinessCardProtectedRoute>
                }
              />
              <Route
                path="/business-card/ceo-details-list"
                element={
                  <BusinessCardProtectedRoute>
                    <CeoDetailsListPage />
                  </BusinessCardProtectedRoute>
                }
              />
              {/* ✅ FREELANCE MARKETPLACE ROUTES (EMPLOYEE/COMPANY) */}
              {/* ===================================================== */}
              <Route path="/employee-login" element={<EmployeeLogin />} />
              <Route path="/employee-register" element={<EmployeeRegister />} />
              <Route
                path="/employee-dashboard"
                element={
                  <EmployeeProtectedRoutes>
                    <EmployeeDashboard />
                  </EmployeeProtectedRoutes>
                }
              />
              <Route
                path="/employee-requirement-list"
                element={
                  <EmployeeProtectedRoutes>
                    <RequirementList />
                  </EmployeeProtectedRoutes>
                }
              />
              <Route
                path="/employee-freelancers/:companyId/:requirementId"
                element={
                  <EmployeeProtectedRoutes>
                    <FreelancerProfiles />
                  </EmployeeProtectedRoutes>
                }
              />
              <Route
                path="/employee-assigned-freelancers/:companyId"
                element={
                  <EmployeeProtectedRoutes>
                    <AssignedFreelancersPage />
                  </EmployeeProtectedRoutes>
                }
              />
              {/* Employee / Internal */}
              <Route
                path="/userPanelLayout"
                element={
                  <TaskProtectedRoute>
                    <PlanOfTheDay />
                  </TaskProtectedRoute>
                }
              />
              <Route
                path="/planoftheday"
                element={
                  <TaskProtectedRoute>
                    <PlanOfTheDay />
                  </TaskProtectedRoute>
                }
              />
              <Route
                path="/userinstructionsview"
                element={
                  <TaskProtectedRoute>
                    <EmployeeInteractions />
                  </TaskProtectedRoute>
                }
              />
              <Route
                path="/employeeprofile"
                element={
                  <TaskProtectedRoute>
                    <MobileNumberUpdate />
                  </TaskProtectedRoute>
                }
              />
              <Route
                path="/taskmanagement/chatview/:id"
                element={
                  <TaskProtectedRoute>
                    <EmployeeViewChat />
                  </TaskProtectedRoute>
                }
              />
              <Route
                path="/taskupdated"
                element={
                  <TaskProtectedRoute>
                    <TaskUpdate />
                  </TaskProtectedRoute>
                }
              />
              <Route
                path="/leaveapproval"
                element={
                  <TaskProtectedRoute>
                    <LeaveApplicationPage />
                  </TaskProtectedRoute>
                }
              />
              <Route
                path="/leavestatus"
                element={
                  <TaskProtectedRoute>
                    <TeamLeaveStatus />
                  </TaskProtectedRoute>
                }
              />
              <Route
                path="/all-statuses"
                element={
                  <TaskProtectedRoute>
                    <AllStatusPage />
                  </TaskProtectedRoute>
                }
              />
              <Route
                path="/assigned-task"
                element={
                  <TaskProtectedRoute>
                    <AdminTasks />
                  </TaskProtectedRoute>
                }
              />
              <Route
                path="/assigned-task-status"
                element={
                  <TaskProtectedRoute>
                    <Assignedtasksbasedstatus />
                  </TaskProtectedRoute>
                }
              />
              <Route
                path="/taskassigneduser"
                element={
                  <TaskProtectedRoute>
                    <TaskAssignedUser />
                  </TaskProtectedRoute>
                }
              />

              {/* Auth / Help */}
              <Route path="/secure-login" element={<HiddenLogin />} />
              <Route path="/forgot" element={<ForgotPasswordPage />} />
              <Route path="/contactus" element={<ContactUs />} />
              <Route path="/faqs" element={<RiceOfferFAQs />} />

              {/* Study Abroad */}
              <Route path="/studyabroad" element={<StudyAbroadLandingPage />} />
              <Route path="/all-universities" element={<AllUniversities />} />
              <Route
                path="/student-dashboard"
                element={<StudentMainDashboard />}
              />
              <Route path="/student-home" element={<UserSelectionPage />} />
              <Route
                path="/google-analytics-dashboard"
                element={<GoogleAnalyticsDashboard />}
              />
              <Route
                path="/listofuniversities"
                element={<UniversityListPage />}
              />

              {/* Misc */}
              <Route path="/qrcode" element={<QR />} />
              <Route path="/agenticai" element={<AgenticAi />} />
              <Route
                path="/bharat-agentbusiness"
                element={<CreateAgentStep2 />}
              />
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
              <Route path="/future" element={<Landingpage />} />
              <Route path="/apidocs" element={<ApiDocs />} />
              <Route path="/womensday" element={<WomensDay />} />

              <Route
                path="/radha/emirates-nbd-ai-intelligence"
                element={<EmiratesNBDAIIntelligenceReport2026 />}
              />
              <Route
                path="/radha/fab-ai-intelligence"
                element={<FABAIIntelligenceReport2026 />}
              />
              <Route
                path="/radha/uae-banks-ai-intelligence"
                element={<UAEBanksAIIntelligenceHub />}
              />

              <Route
                path="/radha/adib-ai-intelligence"
                element={<ADIBAIIntelligenceReport2026 />}
              />
              <Route
                path="/radha/dib-ai-intelligence"
                element={<DIBAIIntelligenceReport2026 />}
              />

              <Route
                path="/radha/adcb-ai-intelligence"
                element={<ADCBAIIntelligenceReport2026 />}
              />
              <Route
                path="/radha/cbd-ai-intelligence"
                element={<CBDAIIntelligenceReport2026 />}
              />
              <Route
                path="/radha/rakbank-ai-intelligence"
                element={<RAKBANKAIIntelligenceReport2026 />}
              />
              <Route
                path="/radha/nbf-ai-intelligence"
                element={<NBFAIIntelligenceReport2026 />}
              />
              <Route
                path="/radha/mashreq-ai-intelligence"
                element={<MashreqAIIntelligenceReport2026 />}
              />
              <Route
                path="/radha/sib-ai-intelligence"
                element={<SIBAIIntelligenceReport2026 />}
              />
              <Route path="/privacypolicy" element={<PrivacyPolicy />} />
              <Route path="/bmvpdf" element={<BMVPDF />} />

              <Route path="/teststore" element={<TestStore />} />
              <Route
                path="/:id/:agentId/:agentname/test"
                element={<TestAgentDetails />}
              />
              <Route path="/email-campaign" element={<UploadPage />} />
              <Route path="/email-campaign/upload" element={<UploadPage />} />
              <Route
                path="/email-campaign/send-campaign"
                element={<SendCampaignPage />}
              />
              <Route
                path="/email-campaign/all-documents"
                element={<AllDocumentsPage />}
              />
              <Route
                path="/email-campaign/all-campaigns"
                element={<AllCampaignsRoute />}
              />
              <Route
                path="/email-campaign/scorecard/:batchId"
                element={<ScorecardPage />}
              />
              <Route
                path="/email-campaign/conversations/:batchId"
                element={<ConversationsPage />}
              />
              <Route path="/may2Interview" element={<HiringLandingPage />} />
              <Route path="/walkin-journey" element={<WalkInJourneyPage />} />
              <Route path="/lenderjourney" element={<LenderHomePage />} />
              <Route path="/resume-ai-interview" element={<ATSResumeChecker />} />
              <Route path="/resume-ai-interview/report/:jobId" element={<ResumeAnalysisReport />} />
              <Route
                path="/DRAcertification"
                element={<DRACertificationLanding />}
              />

              {/* ===================================================== */}
              {/* ✅ PROTECTED MAIN APP ROUTES (/main) */}
              {/* ===================================================== */}
              <Route
                path="/main"
                element={
                  <RequireAuth>
                    <Content1 />
                  </RequireAuth>
                }
              >
                {/* Default */}
                <Route
                  index
                  element={<Navigate to="/main/dashboard/products" replace />}
                />
                <Route
                  path="/main/dashboard/accomdation-gpt"
                  element={<AccomidationGpt />}
                />
                <Route
                  path="/main/dashboard/applicationsupport-gpt"
                  element={<ApplicationSupport />}
                />
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
                  path="/main/dashboard/accreditations-gpt"
                  element={<AccreditationsRecognization />}
                />
                <Route
                  path="/main/dashboard/barcodescanner"
                  element={<BarcodeScanner />}
                />
                <Route
                  path="/main/dashboard/placements-gpt"
                  element={<PlacementsGpt />}
                />
                <Route
                  path="/main/dashboard/qualificationspecialization-gpt"
                  element={<QualificationSpecializationGPT />}
                />{" "}
                <Route
                  path="/main/dashboard/courses-gpt"
                  element={<CoursesGpt />}
                />{" "}
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
                <Route
                  path="/main/job-analysis-result"
                  element={<JobAnalysisResult />}
                />
                <Route path="/main/exam" element={<ExamPage />} />
                <Route
                  path="/main/exam/question/:questionNumber"
                  element={<ExamQuestionPage />}
                />
                <Route
                  path="/main/exam/results"
                  element={<ExamResultsPage />}
                />
                <Route path="/main/dashboard/home" element={<Home />} />
                <Route path="/main/dashboard/rice-gpt" element={<RiceGpt />} />
                <Route
                  path="/main/dashboard/universitiesagents-gpt"
                  element={<UniversityAgents />}
                />
                <Route path="/main/dashboard/visa-gpt" element={<VisaGpt />} />
                {/* Internal */}
                <Route path="dashboard/:tab" element={<DashboardMain />} />
                <Route path="dashboard/myservices" element={<ServicesPage />} />
                           <Route path="dashboard/leaguejourneys" element={<LeagueJourneysPage />} />
                <Route path="dashboard/myblogs" element={<BlogsPage />} />
                <Route path="jobdetails" element={<JobDetails />} />
                <Route path="jobdetails/:id" element={<JobDetails />} />
                <Route path="caserviceitems" element={<CAServicesItems />} />
                <Route path="cartcaservice" element={<CartCaCsService />} />
                <Route path="servicecalist" element={<ServiceCAList />} />
                <Route path="servicedashboard" element={<ServiceDashboard />} />
                <Route
                  path="services/Freechatgpt"
                  element={<FreeChatGPTmain />}
                />
                <Route
                  path="services/myrotary"
                  element={<MyRotaryServices />}
                />
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
                <Route
                  path="services/freeai-genai"
                  element={<FreeAiandGenAi />}
                />
                <Route
                  path="services/legalservice"
                  element={<LegalService />}
                />
                <Route
                  path="services/we-are-hiring"
                  element={<HiringService />}
                />
                {/* Wallet / Orders / Profile etc (already protected by /main) */}
                <Route path="wallet" element={<MyWalletPage />} />
                <Route path="myorders" element={<MyOrders />} />
                <Route
                  path="/main/freelanceappliedlist"
                  element={<FreelancersByUserId />}
                />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="referral" element={<ReferralPage />} />
                <Route path="bulkinvite" element={<BulkInvite />} />
                <Route path="google" element={<GmailContactsScreen />} />
                <Route path="mycart" element={<CartPage />} />
                <Route path="agent-offers" element={<AgentComboOffersPage />} />
                <Route path="freelanceform" element={<FreelancerForm />} />
                <Route path="addblogs" element={<AddBlog />} />
                <Route
                  path="services/:id/:type"
                  element={<CampaignDetails />}
                />
                <Route path="blog/:id/:type" element={<BlogDetails />} />
                <Route path="viewjobdetails" element={<JobViewPage />} />
                <Route path="viewjobdetails/:id" element={<JobViewPage />} />
                <Route
                  path="viewjobdetails/:id/:company"
                  element={<JobViewPage />}
                />
                <Route path="subscription" element={<SubscriptionPage />} />
                <Route path="writetous" element={<WriteToUs />} />
                <Route path="writetous/:id" element={<WriteToUs />} />
                <Route path="crypto" element={<MyCrypto />} />
                <Route path="tickethistory" element={<TicketHistoryPage />} />
                <Route path="search-main" element={<SearchMain />} />
                <Route path="lenderjourney" element={<LenderHomePage />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route
                  path="manageaddresses"
                  element={<ManageAddressesPage />}
                />
                <Route
                  path="bharath-aistore/agents"
                  element={<AllAgentsPage />}
                />
                <Route path="create-aiagent" element={<CreateAgentWizard />} />
                <Route path="bharat-expert" element={<CreateAgentMain />} />
                <Route path="appliedjobs" element={<AppliedJobs />} />
                <Route path="agentcreate" element={<QuickAgentCreate />} />
                <Route
                  path="usercreateaistore"
                  element={<AgentStoreManager />}
                />
                <Route path="chatbasedagent" element={<ChatBasedAgent />} />
                <Route
                  path="chatinterface/assistant/:id/:agentId"
                  element={<ChatInterface1 />}
                />
                {/* ✅ Deep link route (your requirement) */}
                <Route
                  path="itemsdisplay/:itemId"
                  element={<ItemDisplayPage />}
                />
              </Route>
              {/* ===================================================== */}
              {/* ✅ PARTNER ROUTES */}
              {/* ===================================================== */}
              <Route path="/partnerlogin" element={<PartnerLogin />} />
              <Route path="/home" element={<PartnerHome />}>
                <Route index element={<MainPage />} />
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
                <Route
                  path="createFromImageText"
                  element={<CreateFromImageText />}
                />
              </Route>

              {/* ===================================================== */}
              {/* ✅ ADMIN ROUTES */}
              {/* ===================================================== */}
              <Route path="/admin" element={<Login />} />
              <Route path="/adminRegister" element={<Register />} />
              <Route path="/admin" element={<AdminSidebar />}>
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
                <Route path="addleaguejourney" element={<AddLeagueJourney />} />
                <Route path="leaguejourneyusers" element={<LeagueJourneysAdmin />} />
                <Route path="advocates" element={<AdvocatesDataPage />} />
                <Route
                  path="lender-calling-followups"
                  element={<CallingTeamCallbackRequests />}
                />
                <Route path="talwardata" element={<TalwarDataPage />} />
                <Route path="mumbaidata" element={<MumbaiDataPage />} />
                <Route
                  path="assignedtalwarData"
                  element={<TalwarAssignedDataPage />}
                />
                <Route
                  path="sendpollbasedrewards"
                  element={<SendPollBasedRewards />}
                />
                <Route
                  path="viewpollbasedrewards"
                  element={<ViewPollBasedRewards />}
                />
                <Route path="assignedData" element={<AssignedDataPage />} />
                <Route
                  path="userOrdersIntegration"
                  element={<UserOrdersIntegration />}
                />
                <Route
                  path="rammohandarisa"
                  element={<RamMohanDarisaAgents />}
                />
                <Route
                  path="sudheervakkalagadda"
                  element={<SudheerVakkalagadda />}
                />
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
                <Route path="allroleblogs" element={<RoleBasedBlogsList />} />
                <Route path="addroleblogs" element={<AddRoleBasedBlog />} />
                <Route path="todaycalls" element={<CallerHistoryPage />} />
                <Route path="addblogs" element={<AddBlog />} />
                <Route path="orderstats" element={<OrderStatsDashboard />} />
                <Route path="updatestock" element={<StockUpdate />} />
                <Route
                  path="superAdminComments"
                  element={<SuperAdminComments />}
                />
                <Route path="pincodeorders" element={<OrdersByPincode />} />
                <Route path="cbsdata" element={<CbsDataPage />} />
                <Route path="alljobdetails" element={<JobsAdminPage />} />
                <Route path="userAppliedJobs" element={<UserAppliedJob />} />
                <Route path="assistants" element={<AssistantDashboard />} />
                <Route
                  path="conversation/:assistantId"
                  element={<AssistantOverview />}
                />
                <Route path="createassistant" element={<CreateAssistant />} />
                <Route path="vectorstore" element={<VectorStorePage />} />
                <Route
                  path="partners-dashboard"
                  element={<Partnersdasboard />}
                />
                <Route
                  path="freelance-requirements"
                  element={<AdminRequirementList />}
                />
                <Route
                  path="assigned-freelancers/:companyId"
                  element={
                    <AssignedFreelancerAdmin
                      companyId=""
                      isMobileScreen={false}
                    />
                  }
                />
              </Route>

              {/* ✅ LANDING */}
              {/* ===================================================== */}
              <Route path="/" element={<CurrentLandingPage />} />

              {/* ===================================================== */}
              {/* ✅ FALLBACK */}
              {/* ===================================================== */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Suspense>
      </SearchProvider>
    </CartProvider>
  );
};

export default App;
