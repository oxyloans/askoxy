import React from "react";
import CustomerCreationId from "../Components/System/CustomerCreationId";
import LinkingOfCoApplicantGuarantor from "../Components/System/LinkingOfCoApplicantGuarantor";
import LinkingOfCoApplicantGuarantorBusiness from "../Components/Business/LinkingOfCoApplicantGuarantorBusiness";
import WFLoanOrganizationSystemAppraisal from "../Components/System/WFLoanOrganizationSystemAppraisal";
import WFLoanOrganizationSystemAppraisalBusiness from "../Components/Business/WFLoanOrganizationSystemAppraisalBusiness";
import LinkingOfCustomerIdToLoan from "../Components/System/LinkingOfCustomerIdToLoan";
import LinkingOfCustomerIdToLoanBusiness from "../Components/Business/LinkingOfCustomerIdToLoanBusiness";
import WFLoanAssessment from "../Components/System/WFLoanAssessment";
import WFLoanAssessmentBusiness from "../Components/Business/WFLoanAssessmentBusiness";
import WFRecommendationsBusiness from "../Components/Business/WFRecommendationsBusiness";
import RecommendationsWorkflow from "../Components/System/RecommendationsWorkflow";
import WfForRiskAnalysis from "../Components/System/WF_for_Risk_Analysis";
import WfForRiskAnalysisBusiness from "../Components/Business/WF_for_Risk_Analysis_Business";
import WFSanctionLetterGenerationCustomerResponse from "../Components/System/WF_for_Sanction_Letter_Generation_Customer_Response";
import WFSanctionLetterGenerationCustomerResponseBusiness from "../Components/Business/WF_for_Sanction_Letter_Generation_Customer_Response_Business";
import WFForSanctionOfLoan from "../Components/System/WF_for_Sanction_of_Loan";
import WFSanctionOfLoanBusiness from "../Components/Business/WF_for_Sanction_of_Loan_Business";
import WFForTermsConditions from "../Components/System/WF_for_Terms_Conditions";
import WFForTermsConditionsBusiness from "../Components/Business/WF_for_Terms_Conditions_Business";
import WFCapturingProposedAssetDetailsBusiness from "../Components/Business/WF_for_Capturing_Proposed_Asset_Details_Business";
import WFCapturingProposedAssetDetails from "../Components/System/Capturing_Proposed_Asset_Details";
import WFForCheckLimit from "../Components/System/WF_for_Check_Limit";
import WFForCheckLimitBusiness from "../Components/Business/WF_for_Check_Limit_Business";
import WFEvaluatingTheNetworthOfTheParties from "../Components/System/WF_for_Evauating_the_Networth_of_the_Parties";
import WFEvaluatingTheNetworthOfThePartiesBusiness from "../Components/Business/WF_for_Evauating_the_Networth_of_the_Parties_Business";
const DummyComponent: React.FC<{ title: string }> = ({ title }) => (
  <div className="p-4 bg-gray-100 text-center">{title} Component</div>
);

export const useCaseRoutes: Record<
  string,
  { title: string; business: JSX.Element; system: JSX.Element }
> = {
  "customer-id-creation": {
    title: "Customer ID Creation",
    business: <DummyComponent title="Business View of Customer ID Creation" />,
    system: <CustomerCreationId />,
  },
  "co-applicant-linking": {
    title: "Co-applicant & Guarantor Linking",
    business: <LinkingOfCoApplicantGuarantorBusiness />,
    system: <LinkingOfCoApplicantGuarantor />,
  },
  "customer-id-loan-link": {
    title: "Customer ID to Loan Linking",
    business: <LinkingOfCustomerIdToLoanBusiness />,
    system: <LinkingOfCustomerIdToLoan />,
  },
  "loan-appraisal": {
    title: "Loan Appraisal System",
    business: <WFLoanOrganizationSystemAppraisalBusiness />,
    system: <WFLoanOrganizationSystemAppraisal />,
  },
  "loan-assessment": {
    title: "Loan Assessment Workflow",
    business: <WFLoanAssessmentBusiness />,
    system: <WFLoanAssessment />,
  },
  "recommendation-workflow": {
    title: "Recommendation & Sanction Letter",
    business: <WFRecommendationsBusiness />,
    system: <RecommendationsWorkflow />,
  },
  "risk-analysis-upload": {
    title: "Risk Analysis Documentation",
    business: <WfForRiskAnalysisBusiness />,
    system: <WfForRiskAnalysis />,
  },
  "sanction-disbursement": {
    title: "Sanction & Customer Response Tracking",
    business: <WFSanctionLetterGenerationCustomerResponseBusiness />,
    system: <WFSanctionLetterGenerationCustomerResponse />,
  },
  "loan-repayment-schedule": {
    title: "Repayment Schedule Generation",
    business: <WFSanctionOfLoanBusiness />,
    system: <WFForSanctionOfLoan />,
  },
  "terms-conditions-workflow": {
    title: "Terms & Conditions Approval",
    business: <WFForTermsConditionsBusiness />,
    system: <WFForTermsConditions />,
  },
  "asset-details-capture": {
    title: "Asset Details Capture",
    business: <WFCapturingProposedAssetDetailsBusiness />,
    system: <WFCapturingProposedAssetDetails />,
  },
  "limit-check-profile-update": {
    title: "Profile Update & Limit Check",
    business: <WFForCheckLimitBusiness />,
    system: <WFForCheckLimit />,
  },
  "account-closure-process": {
    title: "Account Closure & Net Worth Analysis",
    business: <WFEvaluatingTheNetworthOfThePartiesBusiness />,
    system: <WFEvaluatingTheNetworthOfTheParties />,
  },
  
};
