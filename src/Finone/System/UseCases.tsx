import { useState, useEffect, useRef } from "react";
import {
  ChevronRight,
  FileText,
  Users,
  CreditCard,
  BarChart,
  Search,
  Filter,
  Download,
  ChevronDown,
  X,
  Menu,
} from "lucide-react";
import CustomerIdCreation from "./CustomerIdCreation";
// import LinkingOfCoApplicantGuarantor from "./LinkingOfCoApplicantGuarantor";
// import LinkingOfCustomerIdToLoan from "./LinkingOfCustomerIdToLoan";
// import WFLoanOrganizationSystemAppraisal from "./WFLoanOrganizationSystemAppraisal";
// import WFLoanAssessment from "./WFLoanAssessment";
// import RecommendationsWorkflow from "./RecommendationsWorkflow";
// import WF_for_Risk_Analysis from "./WF_for_Risk_Analysis";
// import WF_for_Sanction_Letter_Generation_Customer_Response from "./WF_for_Sanction_Letter_Generation_Customer_Response";
// import WF_for_Sanction_of_Loan from "./WF_for_Sanction_of_Loan";
// import WF_for_Terms_Conditions from "./WF_for_Terms_Conditions";
// import WF_for_Capturing_Proposed_Asset_Details from "./Capturing_Proposed_Asset_Details";
// import WF_for_Check_Limit from "./WF_for_Check_Limit";
// import WF_for_Evauating_the_Networth_of_the_Parties from "./WF_for_Evauating_the_Networth_of_the_Parties";
// import Allocation_of_Delinquent_Cases_Allocation_Hold from "./Allocation_of_Delinquent_Cases_Allocation_Hold";
import Asset_detials_Use_Case from "./Asset_detials_Use_Case";
// import Define_Allocation_Use_Case from "./Define_Allocation_Use_Case";
// import Manual_Allocation_Use_Case from "./Manual_Allocation_Use_Case";
// import Manual_Reallocation_Use_Case from "./Manual_Reallocation_Use_Case";
// import Beginning_of_Day_Use_Case from "./Beginning_of_Day_Use_Case";
import Define_Queue_Use_Case from "./Define_Queue_Use_CaseProps";
import Contact_Recording from "./Contact_Recording_Use_Case";
import Legal_Collections_Use_Case from "./Legal_Collections_Use_Case";
import Prioritize_Queue_Use_Case from "./Prioritize_Queue_Use_Case";
import Queue_Communication_Mapping_Use_Case from "./Queue_Communication_Mapping_Use_Case";
import Queue_Curing_Use_Case from "./Queue_Curing_Use_CaseProps";
import WorkPlan_Use_Case from "./Work_Plan_Use_Case";
import PDC_Printing_Use_Case from "./PDC_Printing_Use_Case";
import WF_Installment_Prepayment_Use_Case from "./WF_Installment_Prepayment_Use_Case";
import WF_NPA_Grading_Use_Case from "./WF_NPA_Grading_Use_Case";
// import WF_NPA_Provisioning_Use_Case from "./WF_NPA_Provisioning_Use_Case";
import WF_Settlements_Knock_Off_Use_Case from "./WF_Settlements_Knock_Off_Use_Case";
import WF_Settlements_Cheque_Processing_Use_Case from "./WF_Settlements_Cheque_Processing_Use_Case";
import WF_Settlements_Manual_Advice_Use_Case from "./WF_Settlements_Manual_Advice_Use_Case";
import WF_Termination_Foreclosure_Closure_Use_Case from "./WF_Termination_Foreclosure_Closure_Use_Case";
import WF_FMS_Finance_Viewer_Use_Case from "./WF_FMS_Finance_Viewer_Use_Case";
import WF_FMS_Floating_Review_Process_Use_Case from "./WF_FMS_Floating_Review_Process_Use_Case";
import WF_FMS_Settlements_Receipts_Use_Case from "./WF_FMS_Settlements_Receipts_Use_Case";
import WF_FMS_Settlements_Payments_Use_Case from "./WF_FMS_Settlements_Payments_Use_Case";
import WF_FMS_Settlements_Waive_Off_Use_Case from "./WF_FMS_Settlements_Waive_Off_Use_Case";
import WF_FMS_EOD_BOD_Use_Case from "./WF_FMS_EOD_BOD_Use_Case";
import WF_Closure_View_Account_Status_Use_Case from "./WF_Closure_View_Account_Status_Use_Case";
import WF_Document_Master_Use_Case from "./WF_Document_Master_Use_Case";
import System_Use_Case_Closure_Account from "./System_Use_Case_Closure_Account";
import WF_Finance_Rescheduling_Bulk_Prepayment_Use_Case from "./WF_Finance_Rescheduling_Bulk_Prepayment_Use_Case";
import WF_Finance_Rescheduling_Due_Date_Change_Use_Case from "./WF_Finance_Rescheduling_Due_Date_Change_Use_Case";
import WF_Finance_Rescheduling_Profit_Rate_Change_Use_Case from "./WF_Finance_Rescheduling_Profit_Rate_Change_Use_Case";
import WF_Finance_Rescheduling_Tenure_Change_Use_Case from "./WF_Finance_Rescheduling_Tenure_Change_Use_Case";
import WF_Post_Disbursal_Edit_Use_Case_Updated from "./WF_Post_Disbursal_Edit_Use_Case_Updated";
import WF_Repayment_Deferral_Constitution_Wise_Use_Case from "./WF_Repayment_Deferral_Constitution_Wise_Use_Case";
import WF_Repayment_Deferral_Finance_Wise_Use_Case from "./WF_Repayment_Deferral_Finance_Wise_Use_Case";
import WF_Repayment_Deferral_Portfolio_Wise_Use_Case from "./WF_Repayment_Deferral_Portfolio_Wise_Use_Case";
import Askoxylogo from "../../assets/img/askoxylogostatic.png";
import CustomerIdCreation1 from "../Busyness/CustomerIdCreationBusiness";
// import LinkingOfCoApplicantGuarantorBusiness from "../Busyness/LinkingOfCoApplicantGuarantorBusiness";
// import LinkingOfCustomerIdToLoanBusiness from "../Busyness/LinkingOfCustomerIdToLoanBusiness";
// import WFLoanOrganizationSystemAppraisalBusiness from "../Busyness/WFLoanOrganizationSystemAppraisalBusiness";
// import WFLoanAssessmentBusiness from "../Busyness/WFLoanAssessmentBusiness";
// import WFRecommendationsBusiness from "../Busyness/WFRecommendationsBusiness";
// import WF_for_Risk_Analysis_Business from "../Busyness/WF_for_Risk_Analysis_Business";
// import WF_for_Sanction_Letter_Generation_Customer_Response_Business from "../Busyness/WF_for_Sanction_Letter_Generation_Customer_Response_Business";
// import WF_for_Sanction_of_Loan_Business from "../Busyness/WF_for_Sanction_of_Loan_Business";
// import WF_for_Terms_Conditions_Business from "../Busyness/WF_for_Terms_Conditions_Business";
// import WF_for_Capturing_Proposed_Asset_Details_Business from "../Busyness/WF_for_Capturing_Proposed_Asset_Details_Business";
// import WF_for_Check_Limit_Business from "../Busyness/WF_for_Check_Limit_Business";
// import WF_for_Evauating_the_Networth_of_the_Parties_Business from "../Busyness/WF_for_Evauating_the_Networth_of_the_Parties_Business";
// import Allocation_of_Delinquent_Cases_Allocation_Hold_Business from "../Busyness/Allocation_of_Delinquent_Cases_Allocation_Hold_Business";
// import Define_Allocation_Use_Case_Business from "../Busyness/Define_Allocation_Use_Case_Business";
// import Manual_Allocation_Use_Case_Business from "../Busyness/Manual_Allocation_Use_Case_Business";
// import Manual_Reallocation_Use_Case_Business from "../Busyness/Manual_Reallocation_Use_Case_Business";
// import Beginning_of_Day_Use_Case_Business from "../Busyness/Beginning_of_Day_Use_Case_Business";
import Define_Queue_Use_Case_Business from "../Busyness/Define_Queue_Use_Case_Business";
import Contact_Recording_Business from "../Busyness/Contact_Recording_Business";
import Legal_Collections_Use_Case_Business from "../Busyness/Legal_Collections_Use_Case_Business";
import Prioritize_Queue_Use_Case_Business from "../Busyness/Prioritize_Queue_Use_Case_Business";
import Queue_Communication_Mapping_Use_Case_Business from "../Busyness/Queue_Communication_Mapping_Use_Case_Business";
import Queue_Curing_Use_Case_Business from "../Busyness/Queue_Curing_Use_Case_Business";
import WorkPlan_Use_Case_Business from "../Busyness/WorkPlan_Use_Case_Business";
import EodBodDisplay from "../Busyness/EodBodDisplay";
import AccountClosureDisplay from "../Busyness/AccountClosureDisplay";
import ViewAccountStatusDisplay from "../Busyness/ViewAccountStatusDisplay";
import DocumentMasterDisplay from "../Busyness/DocumentMasterDisplay";
import FinanceReschedulingDisplay from "../Busyness/FinanceReschedulingDisplay";
import FinanceReschedulingDueDateDisplay from "../Busyness/FinanceReschedulingDueDateDisplay";
// import WorkPlan_Use_Case_Business from "../Busyness/Work_Plan_Use_Case_Business"; // Removed as the module does not exist

// import CustomerIdCreation from "./Business/CustomerIdCreationBusiness"; // Removed as the module does not exist

//--------------------------------//

// Interfaces
interface UseCase {
  id: string;
  name: string;
  component?: React.FC;
  description: string;
  type: "system" | "business";
}

interface Domain {
  id: string;
  name: string;
  icon: JSX.Element;
  useCases: UseCase[];
}

const UseCases: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedUseCase, setSelectedUseCase] = useState<UseCase | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showFilterDropdown, setShowFilterDropdown] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [selectedUseCaseType, setSelectedUseCaseType] = useState<
    "business" | "system" | null
  >(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const useCasesRef = useRef<HTMLDivElement>(null);

  // Handle responsive design
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle outside click for filter dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setShowFilterDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Define domains and use cases
  const domains: Domain[] = [
    {
      id: "cas",
      name: "Customer Acquisition System",
      icon: <Users size={24} className="text-indigo-600" />,
      useCases: [
        {
          id: "cas-1",
          name: "Customer ID Creation",
          description:
            "Streamlined digital onboarding with identity verification",
          component: CustomerIdCreation,
          type: "system",
        },
        {
          id: "cas-1",
          name: "Customer ID Creation",
          description:
            "Streamlined digital onboarding with identity verification",
          component: CustomerIdCreation1,
          type: "business",
        },
        // {
        //   id: "cas-2",
        //   name: "Linking of Co-applicant Guarantor",
        //   description:
        //     "Secure linking process for co-applicants and guarantors",
        //   component: LinkingOfCoApplicantGuarantor,
        //   type: "system",
        // },
        // {
        //   id: "cas-2",
        //   name: "Linking of Co-applicant Guarantor",
        //   description:
        //     "Secure linking process for co-applicants and guarantors",
        //   component: LinkingOfCoApplicantGuarantorBusiness,
        //   type: "business",
        // },
        // {
        //   id: "cas-3",
        //   name: "Linking of Customer ID to Loan",
        //   description: "Automated loan assignment and eligibility verification",
        //   component: LinkingOfCustomerIdToLoan,
        //   type: "system",
        // },
        // {
        //   id: "cas-3",
        //   name: "Linking of Customer ID to Loan",
        //   description: "Automated loan assignment and eligibility verification",
        //   component: LinkingOfCustomerIdToLoanBusiness,
        //   type: "business",
        // },
        // {
        //   id: "cas-4",
        //   name: "WF_Loan Organization System_Appraisal",
        //   description: "Comprehensive loan appraisal workflow management",
        //   component: WFLoanOrganizationSystemAppraisal,
        //   type: "system",
        // },
        // {
        //   id: "cas-4",
        //   name: "WF_Loan Organization System_Appraisal",
        //   description: "Comprehensive loan appraisal workflow management",
        //   component: WFLoanOrganizationSystemAppraisalBusiness,
        //   type: "business",
        // },
        // {
        //   id: "cas-5",
        //   name: "Work Flow for Loan Assessment",
        //   description: "Structured loan evaluation and decision-making process",
        //   component: WFLoanAssessment,
        //   type: "system",
        // },
        // {
        //   id: "cas-5",
        //   name: "Work Flow for Loan Assessment",
        //   description: "Structured loan evaluation and decision-making process",
        //   component: WFLoanAssessmentBusiness,
        //   type: "business",
        // },
        // {
        //   id: "cas-6",
        //   name: "Work Flow for Recommendations",
        //   description: "Intelligent loan recommendation system",
        //   component: RecommendationsWorkflow,
        //   type: "system",
        // },
        // {
        //   id: "cas-6",
        //   name: "Work Flow for Recommendations",
        //   description: "Intelligent loan recommendation system",
        //   component: WFRecommendationsBusiness,
        //   type: "business",
        // },
        // {
        //   id: "cas-7",
        //   name: "Work Flow for Risk Analysis",
        //   description: "Advanced risk assessment for loan applications",
        //   component: WF_for_Risk_Analysis,
        //   type: "system",
        // },
        // {
        //   id: "cas-7",
        //   name: "Work Flow for Risk Analysis",
        //   description: "Advanced risk assessment for loan applications",
        //   component: WF_for_Risk_Analysis_Business,
        //   type: "business",
        // },
        // {
        //   id: "cas-8",
        //   name: "Work Flow for Sanction Letter Generation & Customers Response",
        //   description:
        //     "Automated sanction letter creation and response tracking",
        //   component: WF_for_Sanction_Letter_Generation_Customer_Response,
        //   type: "system",
        // },
        // {
        //   id: "cas-8",
        //   name: "Work Flow for Sanction Letter Generation & Customers Response",
        //   description:
        //     "Automated sanction letter creation and response tracking",
        //   component:
        //     WF_for_Sanction_Letter_Generation_Customer_Response_Business,
        //   type: "business",
        // },
        // {
        //   id: "cas-9",
        //   name: "Work Flow for Sanction of Loan",
        //   description: "Efficient loan sanctioning process automation",
        //   component: WF_for_Sanction_of_Loan,
        //   type: "system",
        // },
        // {
        //   id: "cas-9",
        //   name: "Work Flow for Sanction of Loan",
        //   description: "Efficient loan sanctioning process automation",
        //   component: WF_for_Sanction_of_Loan_Business,
        //   type: "business",
        // },
        // {
        //   id: "cas-10",
        //   name: "Work Flow for Terms & Conditions",
        //   description: "Standardized terms and conditions management",
        //   component: WF_for_Terms_Conditions,
        //   type: "system",
        // },
        // {
        //   id: "cas-10",
        //   name: "Work Flow for Terms & Conditions",
        //   description: "Standardized terms and conditions management",
        //   component: WF_for_Terms_Conditions_Business,
        //   type: "business",
        // },
        // {
        //   id: "cas-11",
        //   name: "Workflow for Capturing Proposed Asset Details",
        //   description: "Detailed asset information capture process",
        //   component: WF_for_Capturing_Proposed_Asset_Details,
        //   type: "system",
        // },
        // {
        //   id: "cas-11",
        //   name: "Workflow for Capturing Proposed Asset Details",
        //   description: "Detailed asset information capture process",
        //   component: WF_for_Capturing_Proposed_Asset_Details_Business,
        //   type: "business",
        // },
        // {
        //   id: "cas-12",
        //   name: "Workflow for Check Limit",
        //   description: "Automated credit limit verification system",
        //   component: WF_for_Check_Limit,
        //   type: "system",
        // },
        // {
        //   id: "cas-12",
        //   name: "Workflow for Check Limit",
        //   description: "Automated credit limit verification system",
        //   component: WF_for_Check_Limit_Business,
        //   type: "business",
        // },
        // {
        //   id: "cas-13",
        //   name: "Workflow for Evaluating the Networth of the Parties",
        //   description: "Comprehensive net worth assessment workflow",
        //   component: WF_for_Evauating_the_Networth_of_the_Parties,
        //   type: "system",
        // },
        // {
        //   id: "cas-13",
        //   name: "Workflow for Evaluating the Networth of the Parties",
        //   description: "Comprehensive net worth assessment workflow",
        //   component: WF_for_Evauating_the_Networth_of_the_Parties_Business,
        //   type: "business",
        // },
      ],
    },
    {
      id: "collections",
      name: "Collections Management",
      icon: <CreditCard size={24} className="text-indigo-600" />,
      useCases: [
        // {
        //   id: "collections-1",
        //   name: "Allocation of Delinquent Cases_Allocation Hold",
        //   description: "Strategic hold placement for delinquent accounts",
        //   component: Allocation_of_Delinquent_Cases_Allocation_Hold,
        //   type: "system",
        // },
        // {
        //   id: "collections-1",
        //   name: "Allocation of Delinquent Cases_Allocation Hold",
        //   description: "Strategic hold placement for delinquent accounts",
        //   component: Allocation_of_Delinquent_Cases_Allocation_Hold_Business,
        //   type: "business",
        // },
        // {
        //   id: "collections-2",
        //   name: "Allocation of Delinquent Cases_Define Allocation contract",
        //   description: "Custom allocation rules for delinquent cases",
        //   component: Define_Allocation_Use_Case,
        //   type: "system",
        // },
        // {
        //   id: "collections-2",
        //   name: "Allocation of Delinquent Cases_Define Allocation contract",
        //   description: "Custom allocation rules for delinquent cases",
        //   component: Define_Allocation_Use_Case_Business,
        //   type: "business",
        // },
        // {
        //   id: "collections-3",
        //   name: "Allocation of Delinquent Cases_Manual Allocation",
        //   description: "Manual assignment of delinquent accounts",
        //   component: Manual_Allocation_Use_Case,
        //   type: "system",
        // },
        // {
        //   id: "collections-3",
        //   name: "Allocation of Delinquent Cases_Manual Allocation",
        //   description: "Manual assignment of delinquent accounts",
        //   component: Manual_Allocation_Use_Case_Business,
        //   type: "business",
        // },
        // {
        //   id: "collections-4",
        //   name: "Allocation of Delinquent Cases_Manual Reallocation",
        //   description: "Flexible reallocation of delinquent cases",
        //   component: Manual_Reallocation_Use_Case,
        //   type: "system",
        // },
        // {
        //   id: "collections-4",
        //   name: "Allocation of Delinquent Cases_Manual Reallocation",
        //   description: "Flexible reallocation of delinquent cases",
        //   component: Manual_Reallocation_Use_Case_Business,
        //   type: "business",
        // },
        // {
        //   id: "collections-5",
        //   name: "Beginning of Day Process",
        //   description: "Automated daily collections initialization",
        //   component: Beginning_of_Day_Use_Case,
        //   type: "system",
        // },
        // {
        //   id: "collections-5",
        //   name: "Beginning of Day Process",
        //   description: "Automated daily collections initialization",
        //   component: Beginning_of_Day_Use_Case_Business,
        //   type: "business",
        // },
        {
          id: "collections-6",
          name: "Classification of Delinquent Cases - Define Queue",
          description: "Queue-based delinquent case organization",
          component: Define_Queue_Use_Case,
          type: "system",
        },
        {
          id: "collections-6",
          name: "Classification of Delinquent Cases - Define Queue",
          description: "Queue-based delinquent case organization",
          component: Define_Queue_Use_Case_Business,
          type: "business",
        },
        {
          id: "collections-7",
          name: "Contact Recording",
          description: "Comprehensive contact history tracking",
          component: Contact_Recording,
          type: "system",
        },
        {
          id: "collections-7",
          name: "Contact Recording",
          description: "Comprehensive contact history tracking",
          component: Contact_Recording_Business,
          type: "business",
        },
        {
          id: "collections-8",
          name: "Legal Collections Workflow",
          description: "Structured legal collections process",
          component: Legal_Collections_Use_Case,
          type: "system",
        },
        {
          id: "collections-8",
          name: "Legal Collections Workflow",
          description: "Structured legal collections process",
          component: Legal_Collections_Use_Case_Business,
          type: "business",
        },
        {
          id: "collections-9",
          name: "Prioritizing a Queue",
          description: "Intelligent queue prioritization system",
          component: Prioritize_Queue_Use_Case,
          type: "system",
        },
        {
          id: "collections-9",
          name: "Prioritizing a Queue",
          description: "Intelligent queue prioritization system",
          component: Prioritize_Queue_Use_Case_Business,
          type: "business",
        },
        {
          id: "collections-10",
          name: "Queue Communication Mapping",
          description: "Automated communication channel mapping",
          component: Queue_Communication_Mapping_Use_Case,
          type: "system",
        },
        {
          id: "collections-10",
          name: "Queue Communication Mapping",
          description: "Automated communication channel mapping",
          component: Queue_Communication_Mapping_Use_Case_Business,
          type: "business",
        },
        {
          id: "collections-11",
          name: "Queue Curing",
          description: "Efficient queue resolution process",
          component: Queue_Curing_Use_Case,
          type: "system",
        },
        {
          id: "collections-11",
          name: "Queue Curing",
          description: "Efficient queue resolution process",
          component: Queue_Curing_Use_Case_Business,
          type: "business",
        },
        {
          id: "collections-12",
          name: "Work Plan",
          description: "Strategic collections work planning",
          component: WorkPlan_Use_Case,
          type: "system",
        },
        {
          id: "collections-12",
          name: "Work Plan",
          description: "Strategic collections work planning",
          component: WorkPlan_Use_Case_Business,
          type: "business",
        },
      ],
    },
    {
      id: "fms",
      name: "Financial Management System",
      icon: <BarChart size={24} className="text-indigo-600" />,
      useCases: [
        {
          id: "fms-1",
          name: "Asset Details",
          description: "Comprehensive asset management and tracking",
          component: Asset_detials_Use_Case,
          type: "system",
        },
        {
          id: "fms-2",
          name: "PDC Printing",
          description: "Automated post-dated cheque processing",
          component: PDC_Printing_Use_Case,
          type: "system",
        },
        {
          id: "fms-3",
          name: "WF_ Installment Prepayment",
          description: "Flexible installment prepayment handling",
          component: WF_Installment_Prepayment_Use_Case,
          type: "system",
        },
        {
          id: "fms-4",
          name: "WF_ NPA Grading",
          description: "Non-performing asset classification system",
          component: WF_NPA_Grading_Use_Case,
          type: "system",
        },
        // {
        //   id: "fms-5",
        //   name: "WF_ NPA Provisioning",
        //   description: "Automated NPA provisioning workflow",
        //   component: WF_NPA_Provisioning_Use_Case,
        //   type: "system",
        // },
        {
          id: "fms-6",
          name: "WF_ Settlements - Knock Off",
          description: "Efficient settlement knock-off process",
          component: WF_Settlements_Knock_Off_Use_Case,
          type: "system",
        },
        {
          id: "fms-7",
          name: "WF_ Settlements_Cheque(Receipt_Payment) Processing",
          description: "Streamlined cheque processing workflow",
          component: WF_Settlements_Cheque_Processing_Use_Case,
          type: "system",
        },
        {
          id: "fms-8",
          name: "WF_ Settlements_Manual Advise",
          description: "Manual settlement advisory system",
          component: WF_Settlements_Manual_Advice_Use_Case,
          type: "system",
        },

        {
          id: "fms-9",
          name: "WF_ Termination - Foreclosure - Closure",
          description: "Structured account termination process",
          component: WF_Termination_Foreclosure_Closure_Use_Case,
          type: "system",
        },
        {
          id: "fms-10",
          name: "WF_FMS_ Finance Viewer",
          description: "Interactive financial data visualization",
          component: WF_FMS_Finance_Viewer_Use_Case,
          type: "system",
        },
        {
          id: "fms-11",
          name: "WF_FMS_ Floating Review Process",
          description: "Dynamic financial review workflow",
          component: WF_FMS_Floating_Review_Process_Use_Case,
          type: "system",
        },
        {
          id: "fms-12",
          name: "WF_FMS_ Settlements - Receipts",
          description: "Automated receipt settlement processing",
          component: WF_FMS_Settlements_Receipts_Use_Case,
          type: "system",
        },
        {
          id: "fms-13",
          name: "WF_FMS_ Settlements_Payment",
          description: "Streamlined payment settlement system",
          component: WF_FMS_Settlements_Payments_Use_Case,
          type: "system",
        },
        {
          id: "fms-14",
          name: "WF_FMS_ Settlements_Waive Off",
          description: "Flexible settlement waive-off process",
          component: WF_FMS_Settlements_Waive_Off_Use_Case,
          type: "system",
        },
        {
          id: "fms-15",
          name: "WF_FMS_EOD_ BOD",
          description: "End-of-day and beginning-of-day processing",
          component: WF_FMS_EOD_BOD_Use_Case,
          type: "system",
        },
        {
          id: "fms-15",
          name: "WF_FMS_EOD_ BOD",
          description: "End-of-day and beginning-of-day processing",
          component: EodBodDisplay,
          type: "business",
        },
        {
          id: "fms-16",
          name: "Work Flow Closure_Account Closure",
          description: "Structured account closure workflow",
          component: System_Use_Case_Closure_Account,
          type: "system",
        },
        {
          id: "fms-16",
          name: "Work Flow Closure_Account Closure",
          description: "Structured account closure workflow",
          component: AccountClosureDisplay,
          type: "business",
        },

        {
          id: "fms-17",
          name: "Work Flow Closure_View Account Status",
          description: "Real-time account status monitoring",
          component: WF_Closure_View_Account_Status_Use_Case,
          type: "system",
        },
        {
          id: "fms-17",
          name: "Work Flow Closure_View Account Status",
          description: "Real-time account status monitoring",
          component: ViewAccountStatusDisplay,
          type: "business",
        },
        {
          id: "fms-18",
          name: "Work Flow_Document Master",
          description: "Centralized document management system",
          component: WF_Document_Master_Use_Case,
          type: "system",
        },
        {
          id: "fms-18",
          name: "Work Flow_Document Master",
          description: "Centralized document management system",
          component: DocumentMasterDisplay,
          type: "business",
        },
        {
          id: "fms-19",
          name: "Work Flow_Finance Rescheduling_Bulk Prepayment",
          description: "Bulk prepayment rescheduling process",
          component: WF_Finance_Rescheduling_Bulk_Prepayment_Use_Case,
          type: "system",
        },
        {
          id: "fms-19",
          name: "Work Flow_Finance Rescheduling_Bulk Prepayment",
          description: "Bulk prepayment rescheduling process",
          component: FinanceReschedulingDisplay,
          type: "business",
        },
        {
          id: "fms-20",
          name: "Work Flow_Finance Rescheduling_Due Date Change",
          description: "Flexible due date modification system",
          component: WF_Finance_Rescheduling_Due_Date_Change_Use_Case,
          type: "system",
        },
        {
          id: "fms-20",
          name: "Work Flow_Finance Rescheduling_Due Date Change",
          description: "Flexible due date modification system",
          component: FinanceReschedulingDueDateDisplay,
          type: "business",
        },
        {
          id: "fms-21",
          name: "Work Flow_Finance Rescheduling_Profit Rate Change",
          description: "Dynamic profit rate adjustment process",
          component: WF_Finance_Rescheduling_Profit_Rate_Change_Use_Case,
          type: "system",
        },
        {
          id: "fms-22",
          name: "Work Flow_Finance Rescheduling_Tenure Change",
          description: "Flexible tenure modification workflow",
          component: WF_Finance_Rescheduling_Tenure_Change_Use_Case,
          type: "system",
        },
        {
          id: "fms-23",
          name: "Work Flow_Post Disbursal Edit",
          description: "Post-disbursal data modification system",
          component: WF_Post_Disbursal_Edit_Use_Case_Updated,
          type: "system",
        },
        {
          id: "fms-24",
          name: "Work Flow_Repayment Deferral_Constitution Wise Deferral",
          description: "Constitution-based repayment deferral",
          component: WF_Repayment_Deferral_Constitution_Wise_Use_Case,
          type: "system",
        },
        {
          id: "fms-25",
          name: "Work Flow_Repayment Deferral_Finance Wise Deferral",
          description: "Finance-specific repayment deferral process",
          component: WF_Repayment_Deferral_Finance_Wise_Use_Case,
          type: "system",
        },
        {
          id: "fms-26",
          name: "Work Flow_Repayment Deferral_Portfolio Wise Deferral",
          description: "Portfolio-based repayment deferral system",
          component: WF_Repayment_Deferral_Portfolio_Wise_Use_Case,
          type: "system",
        },
      ],
    },
  ];

  // Handlers
  const handleDomainClick = (domainId: string) => {
    setIsLoading(true);
    setTimeout(() => {
      const newDomain = domainId === selectedDomain ? null : domainId;
      setSelectedDomain(newDomain);
      setSelectedUseCase(null);
      setSelectedUseCaseType(null);
      setSearchTerm("");
      const params = new URLSearchParams();
      if (newDomain) params.set("domain", newDomain);
      window.history.pushState({}, "", `/glmshome?${params.toString()}`);
      setIsLoading(false);
      if (newDomain && useCasesRef.current) {
        useCasesRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 300);
  };

  const handleUseCaseTypeClick = (type: "business" | "system") => {
    setSelectedUseCaseType(type);
    setSelectedUseCase(null);
  };

  const handleUseCaseClick = (useCase: UseCase) => {
    setIsLoading(true);
    setTimeout(() => {
      setSelectedUseCase(useCase);
      setIsLoading(false);
    }, 300);
  };

  const handleBackToDomains = () => {
    setSelectedDomain(null);
    setSelectedUseCase(null);
    setSelectedUseCaseType(null);
    window.history.pushState({}, "", "/glmshome");
  };

  const handleBackToUseCases = () => {
    setSelectedUseCase(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setSelectedUseCase(null);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogoClick = () => {
    setSelectedDomain(null);
    setSelectedUseCase(null);
    setSelectedUseCaseType(null);
    window.history.pushState({}, "", "/");
    window.location.href = "/";
  };

  // Filter use cases
  const currentDomain = domains.find((d) => d.id === selectedDomain);
  const filteredUseCases = currentDomain?.useCases.filter(
    (useCase) =>
      useCase.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      useCase.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const businessUseCases =
    filteredUseCases?.filter((uc) => uc.type === "business") || [];
  const systemUseCases =
    filteredUseCases?.filter((uc) => uc.type === "system") || [];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center">
            <img
              src={Askoxylogo} // Replace with your logo source
              alt="AskOxy Logo"
              className="h-10 cursor-pointer transition-transform hover:scale-105"
              onClick={handleLogoClick}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleLogoClick();
                }
              }}
              tabIndex={0}
              role="banner"
            />
          </div>
{/* 
          Web Menu */}
          {/* <nav className="hidden md:flex items-center space-x-6">
            <a
              href="/glmshome"
              className="text-gray-600 hover:text-indigo-600 font-medium text-sm transition-colors"
            >
              About
            </a>
            <a
              href="/glmshome"
              className="text-gray-600 hover:text-indigo-600 font-medium text-sm transition-colors"
            >
              Contact
            </a>
          </nav> */}

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label={mobileMenuOpen ? "Close Menu" : "Open Menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X size={24} className="text-gray-600" />
            ) : (
              <Menu size={24} className="text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 px-6 animate-slide-down">
            {/* <nav className="flex flex-col gap-4">
              <a
                href="/glmshome"
                className="text-gray-600 hover:text-indigo-600 font-medium text-sm"
              >
                About
              </a>
              <a
                href="/glmshome"
                className="text-gray-600 hover:text-indigo-600 font-medium text-sm"
              >
                Contact
              </a>
            </nav> */}
          </div>
        )}
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        {/* Main Heading */}
        {!selectedDomain && (
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Global Loan Management System
          </h1>
        )}

        {/* Breadcrumb Navigation */}
        {selectedDomain && (
          <nav
            className="mb-6 flex items-center text-sm text-gray-600"
            aria-label="Breadcrumb"
          >
            <button
              onClick={handleLogoClick}
              className="hover:text-indigo-600 transition-colors"
            >
              Home
            </button>
            <ChevronRight size={16} className="mx-2" />
            <button
              onClick={handleBackToDomains}
              className="hover:text-indigo-600 transition-colors"
            >
              {currentDomain?.name}
            </button>
            {selectedUseCase && (
              <>
                <ChevronRight size={16} className="mx-2" />
                <button
                  onClick={handleBackToUseCases}
                  className="hover:text-indigo-600 transition-colors"
                >
                  {selectedUseCase.name}
                </button>
              </>
            )}
          </nav>
        )}

        {/* Domain Selection */}
        {!selectedDomain && (
          <section
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
            aria-label="Domain selection"
          >
            {domains.map((domain) => (
              <button
                key={domain.id}
                className={`relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 flex items-center ${
                  selectedDomain === domain.id ? "ring-2 ring-indigo-600" : ""
                }`}
                onClick={() => handleDomainClick(domain.id)}
                aria-pressed={selectedDomain === domain.id}
              >
                <div className="mr-4 bg-indigo-50 p-3 rounded-lg">
                  {domain.icon}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {domain.name}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {domain.useCases.length} use cases
                  </p>
                </div>
                <ChevronRight className="text-indigo-600" size={20} />
              </button>
            ))}
          </section>
        )}

        {/* Use Cases Display */}
        {selectedDomain && !selectedUseCase && (
          <section
            ref={useCasesRef}
            className={`bg-white rounded-xl shadow-sm p-6 md:p-8 transition-opacity duration-300 ${
              isLoading ? "opacity-50" : "opacity-100"
            }`}
            aria-live="polite"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-4 bg-indigo-50">
                    {currentDomain?.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {currentDomain?.name}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {currentDomain?.useCases.length} use cases available
                    </p>
                  </div>
                </div>
                <button
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Download all use cases"
                >
                  <Download size={20} className="text-gray-600" />
                </button>
              </div>

              {/* Search and Filter */}
              <div className="mb-8 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search
                    size={20}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search use cases..."
                    className="pl-10 pr-10 py-3 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    aria-label="Search use cases"
                  />
                  {searchTerm && (
                    <button
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      onClick={() => setSearchTerm("")}
                      aria-label="Clear search"
                    >
                      <X
                        size={16}
                        className="text-gray-400 hover:text-gray-600"
                      />
                    </button>
                  )}
                </div>
                <div className="relative" ref={filterRef}>
                  <button
                    className="flex items-center space-x-2 bg-indigo-50 hover:bg-indigo-100 px-4 py-3 rounded-lg text-sm font-medium text-gray-700"
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    aria-expanded={showFilterDropdown}
                  >
                    <Filter size={16} />
                    <span>Filter</span>
                    <ChevronDown size={16} className="text-indigo-600" />
                  </button>
                  {showFilterDropdown && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 animate-fade-in z-10">
                      <div className="p-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Filter by
                        </h4>
                        <label className="flex items-center p-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                          <input
                            type="checkbox"
                            className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          />
                          Recently updated
                        </label>
                        <label className="flex items-center p-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                          <input
                            type="checkbox"
                            className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          />
                          Most viewed
                        </label>
                        <label className="flex items-center p-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                          <input
                            type="checkbox"
                            className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          />
                          Documentation complete
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Search Results */}
              {searchTerm && (
                <p className="mb-6 text-sm text-gray-500">
                  Found {filteredUseCases?.length || 0} results for "
                  {searchTerm}"
                </p>
              )}

              {/* Use Cases Tabs */}
              <div className="mb-6">
                <div className="flex border-b border-gray-200">
                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      selectedUseCaseType === "business"
                        ? "border-b-2 border-indigo-600 text-indigo-600"
                        : "text-gray-500 hover:text-indigo-600"
                    }`}
                    onClick={() => handleUseCaseTypeClick("business")}
                  >
                    Business Use Cases ({businessUseCases.length})
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      selectedUseCaseType === "system"
                        ? "border-b-2 border-indigo-600 text-indigo-600"
                        : "text-gray-500 hover:text-indigo-600"
                    }`}
                    onClick={() => handleUseCaseTypeClick("system")}
                  >
                    System Use Cases ({systemUseCases.length})
                  </button>
                </div>
              </div>

              {/* Use Cases Cards */}
              {selectedUseCaseType && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(selectedUseCaseType === "business"
                    ? businessUseCases
                    : systemUseCases
                  ).map((useCase) => (
                    <button
                      key={useCase.id}
                      className="bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-4 text-left"
                      onClick={() => handleUseCaseClick(useCase)}
                    >
                      <div className="flex items-center mb-2">
                        <FileText size={16} className="text-indigo-600 mr-2" />
                        <h4 className="font-medium text-gray-900 hover:text-indigo-600 transition-colors">
                          {useCase.name}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-3">
                        {useCase.description}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Selected Use Case Component */}
        {selectedUseCase && selectedUseCase.component && (
          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedUseCase.name}
              </h2>
              <p className="text-gray-500 mt-2">
                {selectedUseCase.description}
              </p>
            </div>
            <div className="border-t border-gray-200 pt-6">
              <selectedUseCase.component />
            </div>
          </section>
        )}
      </main>

      <footer className="bg-gray-800 text-white py-6 px-6 mt-auto">
        <div className="max-w-7xl mx-auto text-center text-sm">
          © 2025 AskOxy. All rights reserved.
        </div>
      </footer>

      {/* Animations */}
      <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default UseCases;
