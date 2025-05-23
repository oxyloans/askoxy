import React from "react";
import AssetDetailsUseCase from "../Components/System/Asset_detials_Use_Case";
import PdcPrintingUseCase from "../Components/System/PDC_Printing_Use_Case";
import WfInstallmentPrepaymentUseCase from "../Components/System/WF_Installment_Prepayment_Use_Case";
import WfFmsFinanceViewerUseCase from "../Components/System/WF_FMS_Finance_Viewer_Use_Case";
import WfNpaGradingUseCase from "../Components/System/WF_NPA_Grading_Use_Case";
import WfNpaProvisioningUseCase from "../Components/System/WF_NPA_Provisioning_Use_Case";
import WfSettlementsKnockOffUseCase from "../Components/System/WF_Settlements_Knock_Off_Use_Case";
import WfSettlementsChequeProcessingUseCase from "../Components/System/WF_Settlements_Cheque_Processing_Use_Case";
import WfSettlementsManualAdviceUseCase from "../Components/System/WF_Settlements_Manual_Advice_Use_Case";
import WFTerminationForeclosureClosureUseCase from "../Components/System/WF_Termination_Foreclosure_Closure_Use_Case";
import WfFmsFloatingReviewProcessUseCase from "../Components/System/WF_FMS_Floating_Review_Process_Use_Case";
import WfFmsSettlementsReceiptsUseCase from "../Components/System/WF_FMS_Settlements_Receipts_Use_Case";
import WfFmsSettlementsPaymentsUseCase from "../Components/System/WF_FMS_Settlements_Payments_Use_Case";
import WfFmsSettlementsWaiveOffUseCase from "../Components/System/WF_FMS_Settlements_Waive_Off_Use_Case";
import WfFmsEodBodUseCase from "../Components/System/WF_FMS_EOD_BOD_Use_Case";
import EodBodDisplay from "../Components/Business/EodBodDisplay";
import SystemUseCaseClosureAccount from "../Components/System/System_Use_Case_Closure_Account";
import AccountClosureDisplay from "../Components/Business/AccountClosureDisplay";
import WFClosureViewAccountStatusUseCase from "../Components/System/WF_Closure_View_Account_Status_Use_Case";
import ViewAccountStatusDisplay from "../Components/Business/ViewAccountStatusDisplay";
import WFDocumentMasterUseCase from "../Components/System/WF_Document_Master_Use_Case";
import DocumentMasterDisplay from "../Components/Business/DocumentMasterDisplay";
import WFFinanceReschedulingBulkPrepaymentUseCase from "../Components/System/WF_Finance_Rescheduling_Bulk_Prepayment_Use_Case";
import FinanceReschedulingDisplay from "../Components/Business/FinanceReschedulingDisplay";
import WFFinanceReschedulingDueDateChangeUseCase from "../Components/System/WF_Finance_Rescheduling_Due_Date_Change_Use_Case";
import FinanceReschedulingDueDateDisplay from "../Components/Business/FinanceReschedulingDueDateDisplay";
import WFFinanceReschedulingProfitRateChangeUseCase from "../Components/System/WF_Finance_Rescheduling_Profit_Rate_Change_Use_Case";
import WFFinanceReschedulingTenureChangeUseCase from "../Components/System/WF_Finance_Rescheduling_Tenure_Change_Use_Case";
import WFPostDisbursalEditUseCaseUpdated from "../Components/System/WF_Post_Disbursal_Edit_Use_Case_Updated";
import WFRepaymentDeferralConstitutionWiseUseCase from "../Components/System/WF_Repayment_Deferral_Constitution_Wise_Use_Case";
import WFRepaymentDeferralFinanceWiseUseCase from "../Components/System/WF_Repayment_Deferral_Finance_Wise_Use_Case";
import WfRepaymentDeferralPortfolioWiseUseCase from "../Components/System/WF_Repayment_Deferral_Portfolio_Wise_Use_Case";
import FinanceReschedulingProfitRateChange from "../Components/Business/FinanceReschedulingProfitRateChange";
import FinanceReschedulingTenureChange from "../Components/Business/FinanceReschedulingTenureChange";
import PostDisbursalEdit from "../Components/Business/PostDisbursalEdit";
import RepaymentDeferralConstitutionBased from "../Components/Business/RepaymentDeferralConstitutionBased";
import RepaymentDeferralFinanceWise from "../Components/Business/RepaymentDeferralFinanceWise";
import RepaymentDeferralBatchWise from "../Components/Business/RepaymentDeferralBatchWise";
import MaintainAssetDetails from "../Components/Business/MaintainAssetDetails";
import PDCPrinting from "../Components/Business/PDCPrinting";
import InstallmentPrepayment from "../Components/Business/InstallmentPrepayment";
import NPAGrading from "../Components/Business/NPAGrading";
import NPAProvisioning from "../Components/Business/NPAProvisioning";
import SettlementsKnockOff from "../Components/Business/SettlementsKnockOff";
import SettlementsChequeProcessing from "../Components/Business/SettlementsChequeProcessing";
import SettlementsManualAdvise from "../Components/Business/SettlementsManualAdvise";
import TerminationForeclosureClosure from "../Components/Business/TerminationForeclosureClosure";
import FinanceDetailsViewer from "../Components/Business/FinanceDetailsViewer";
import FloatingReviewProcess from "../Components/Business/FloatingReviewProcess"
import SettlementsReceipts from "../Components/Business/SettlementsReceipts";
import SettlementsPayments from "../Components/Business/SettlementsPayments";
import SettlementsWaiveOff from "../Components/Business/SettlementsWaiveOff";
const DummyComponent: React.FC<{ title: string }> = ({ title }) => (
  <div className="p-4 bg-gray-100 text-center">{title} Component</div>
);


export const useFMSRoutes: Record<
  string,
  { title: string; business: JSX.Element; system: JSX.Element }
> = {
  // New routes from FMSDashboard
  "asset-details": {
    title: "Asset Details",
    business: <MaintainAssetDetails />,
    system: <AssetDetailsUseCase />,
  },
  "allocation-contract": {
    title: "Allocation Contract",
    business: <PDCPrinting />,
    system: <PdcPrintingUseCase />,
  },
  "installment-prepayment": {
    title: "Installment Prepayment",
    business: <InstallmentPrepayment />,
    system: <WfInstallmentPrepaymentUseCase />,
  },
  "case-reallocation": {
    title: "Case Reallocation",
    business: <NPAGrading />,
    system: <WfNpaGradingUseCase />,
  },
  "npa-provisioning": {
    title: "NPA Provisioning",
    business: <NPAProvisioning />,
    system: <WfNpaProvisioningUseCase />,
  },
  "settlement-knockoff": {
    title: "Settlements - Knock Off",
    business: <SettlementsKnockOff />,
    system: <WfSettlementsKnockOffUseCase />,
  },
  "cheque-processing": {
    title: "Cheque Processing",
    business: <SettlementsChequeProcessing />,
    system: <WfSettlementsChequeProcessingUseCase />,
  },
  "settlement-advisory": {
    title: "Settlement Advisory",
    business: <SettlementsManualAdvise />,
    system: <WfSettlementsManualAdviceUseCase />,
  },
  "foreclosure-management": {
    title: "Foreclosure Management",
    business: <TerminationForeclosureClosure />,
    system: <WFTerminationForeclosureClosureUseCase />,
  },
  "finance-viewer": {
    title: "Finance Viewer",
    business: <FinanceDetailsViewer />,
    system: <WfFmsFinanceViewerUseCase />,
  },
  "floating-review": {
    title: "Floating Review Process",
    business: <FloatingReviewProcess />,
    system: <WfFmsFloatingReviewProcessUseCase />,
  },
  "daily-workplan": {
    title: "Agent Work Plan",
    business: <SettlementsReceipts />,
    system: <WfFmsSettlementsReceiptsUseCase />,
  },
  "settlements-payment": {
    title: "Settlements - Payment",
    business: <SettlementsPayments />,
    system: <WfFmsSettlementsPaymentsUseCase />,
  },
  "settlements-waiveoff": {
    title: "Settlements - Waive Off",
    business: <SettlementsWaiveOff />,
    system: <WfFmsSettlementsWaiveOffUseCase />,
  },
  "eod-bod-process": {
    title: "EOD / BOD Process",
    business: <EodBodDisplay />,
    system: <WfFmsEodBodUseCase />,
  },
  "account-closure": {
    title: "Account Closure",
    business: <AccountClosureDisplay />,
    system: <SystemUseCaseClosureAccount />,
  },
  "account-status": {
    title: "Account Status",
    business: <ViewAccountStatusDisplay />,
    system: <WFClosureViewAccountStatusUseCase />,
  },
  "document-master": {
    title: "Document Master",
    business: <DocumentMasterDisplay />,
    system: <WFDocumentMasterUseCase />,
  },
  "bulk-prepayment": {
    title: "Bulk Prepayment",
    business: <FinanceReschedulingDisplay />,
    system: <WFFinanceReschedulingBulkPrepaymentUseCase />,
  },
  "due-date-change": {
    title: "Due Date Change",
    business: <FinanceReschedulingDueDateDisplay />,
    system: <WFFinanceReschedulingDueDateChangeUseCase />,
  },
  "profit-rate-change": {
    title: "Profit Rate Change",
    business: <FinanceReschedulingProfitRateChange />,
    system: <WFFinanceReschedulingProfitRateChangeUseCase />,
  },
  "tenure-change": {
    title: "Tenure Change",
    business: <FinanceReschedulingTenureChange />,
    system: <WFFinanceReschedulingTenureChangeUseCase />,
  },
  "post-disbursal-edit": {
    title: "Post Disbursal Edit",
    business: <PostDisbursalEdit />,
    system: <WFPostDisbursalEditUseCaseUpdated />,
  },
  "deferral-constitution": {
    title: "Deferral - Constitution Wise",
    business: <RepaymentDeferralConstitutionBased />,
    system: <WFRepaymentDeferralConstitutionWiseUseCase />,
  },
  "deferral-financewise": {
    title: "Deferral - Finance Wise",
    business: <RepaymentDeferralFinanceWise />,
    system: <WFRepaymentDeferralFinanceWiseUseCase />,
  },
  "deferral-portfolio": {
    title: "Deferral - Portfolio Wise",
    business: <RepaymentDeferralBatchWise />,
    system: <WfRepaymentDeferralPortfolioWiseUseCase />,
  },
};
