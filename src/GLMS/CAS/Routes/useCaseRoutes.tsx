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
import CustomerIdCreation from "../Components/System/CustomerIdCreation";
import CustomerIdCreation1 from "../Components/Business/CustomerIdCreationBusiness";
// const DummyComponent: React.FC<{ title: string }> = ({ title }) => (
//   <div className="p-4 bg-gray-100 text-center">{title} Component</div>
// );

export const useCaseRoutes: Record<
  string,
  {
    title: string;
    business: JSX.Element;
    system: JSX.Element;
    image?: string;
  }
> = {
  "customer-id-creation": {
    title: "Customer ID Creation",
    business: <CustomerIdCreation1 />,
    system: <CustomerIdCreation />,
    image: "https://i.ibb.co/7dXKJFyq/customer-id-creation.png",
  },
  "co-applicant-linking": {
    title: "Co-applicant & Guarantor Linking",
    business: <LinkingOfCoApplicantGuarantorBusiness />,
    system: <LinkingOfCoApplicantGuarantor />,
    image: "https://i.ibb.co/Gv11dpRk/linking-of-co-applicant-guranter.png",
  },
  "customer-id-loan-link": {
    title: "Customer ID to Loan Linking",
    business: <LinkingOfCustomerIdToLoanBusiness />,
    system: <LinkingOfCustomerIdToLoan />,
    image: "https://i.ibb.co/PsqpSJyK/Linking-of-customer-id-to-loan.png",
  },
  "loan-appraisal": {
    title: "Loan Appraisal System",
    business: <WFLoanOrganizationSystemAppraisalBusiness />,
    system: <WFLoanOrganizationSystemAppraisal />,
    image: "https://i.ibb.co/b5rknXQ6/workflow-for-loan-apparisal.png",
  },
  "loan-assessment": {
    title: "Loan Assessment Workflow",
    business: <WFLoanAssessmentBusiness />,
    system: <WFLoanAssessment />,
    image: "https://i.ibb.co/SwYCRfLQ/workflow-for-loan-assesment.png",
  },
  "recommendation-workflow": {
    title: "Recommendation & Sanction Letter",
    business: <WFRecommendationsBusiness />,
    system: <RecommendationsWorkflow />,
    image: "https://i.ibb.co/MxRvdwK2/work-flow-for-recommendations.png",
  },
  "risk-analysis-upload": {
    title: "Risk Analysis Documentation",
    business: <WfForRiskAnalysisBusiness />,
    system: <WfForRiskAnalysis />,
    image: "https://i.ibb.co/27bX7GGK/15.png",
  },
  "sanction-disbursement": {
    title: "Sanction & Customer Response Tracking",
    business: <WFSanctionLetterGenerationCustomerResponseBusiness />,
    system: <WFSanctionLetterGenerationCustomerResponse />,
    image: "https://i.ibb.co/Q7ZhS8Ft/Usecase13.png",
  },
  "loan-repayment-schedule": {
    title: "Repayment Schedule Generation",
    business: <WFSanctionOfLoanBusiness />,
    system: <WFForSanctionOfLoan />,
    image: "https://i.ibb.co/v6GkKVNF/loan-sanction-letter.png",
  },
  "terms-conditions-workflow": {
    title: "Terms & Conditions Approval",
    business: <WFForTermsConditionsBusiness />,
    system: <WFForTermsConditions />,
    image: "https://i.ibb.co/wnVWrMG/terms-conditions.png",
  },
  "asset-details-capture": {
    title: "Asset Details Capture",
    business: <WFCapturingProposedAssetDetailsBusiness />,
    system: <WFCapturingProposedAssetDetails />,
    image: "https://i.ibb.co/nMntMRSG/caparing-proposed-asset-details.png",
  },
  "limit-check-profile-update": {
    title: "Profile Update & Limit Check",
    business: <WFForCheckLimitBusiness />,
    system: <WFForCheckLimit />,
    image:
      "https://i.ibb.co/279s0FBy/checking-the-eligibility-of-the-customer.png",
  },
  "account-closure-process": {
    title: "Account Closure & Net Worth Analysis",
    business: <WFEvaluatingTheNetworthOfThePartiesBusiness />,
    system: <WFEvaluatingTheNetworthOfTheParties />,
    image:
      "https://i.ibb.co/nsdtW1xZ/work-flow-for-evaluating-the-networth.png",
  },
};
