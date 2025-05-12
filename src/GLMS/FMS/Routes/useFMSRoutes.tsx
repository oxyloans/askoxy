import React from "react";
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
    business: <DummyComponent title="Business View of Loan Linking" />,
    system: <DummyComponent title="System View of Loan Linking" />,
  },
  "allocation-contract": {
    title: "Allocation Contract",
    business: <DummyComponent title="Business View of Loan Linking" />,
    system: <DummyComponent title="System View of Loan Linking" />,
  },
  "installment-prepayment": {
    title: "Installment Prepayment",
    business: <DummyComponent title="Business View of Loan Linking" />,
    system: <DummyComponent title="System View of Loan Linking" />,
  },
  "case-reallocation": {
    title: "Case Reallocation",
    business: <DummyComponent title="Business View of Loan Linking" />,
    system: <DummyComponent title="System View of Loan Linking" />,
  },
  "npa-provisioning": {
    title: "NPA Provisioning",
    business: <DummyComponent title="Business View of Loan Linking" />,
    system: <DummyComponent title="System View of Loan Linking" />,
  },
  "settlement-knockoff": {
    title: "Settlements - Knock Off",
    business: <DummyComponent title="Business View of Loan Linking" />,
    system: <DummyComponent title="System View of Loan Linking" />,
  },
  "cheque-processing": {
    title: "Cheque Processing",
    business: <DummyComponent title="Business View of Loan Linking" />,
    system: <DummyComponent title="System View of Loan Linking" />,
  },
  "settlement-advisory": {
    title: "Settlement Advisory",
    business: <DummyComponent title="Business View of Loan Linking" />,
    system: <DummyComponent title="System View of Loan Linking" />,
  },
  "foreclosure-management": {
    title: "Foreclosure Management",
    business: <DummyComponent title="Business View of Loan Linking" />,
    system: <DummyComponent title="System View of Loan Linking" />,
  },
  "finance-viewer": {
    title: "Finance Viewer",
    business: <DummyComponent title="Business View of Loan Linking" />,
    system: <DummyComponent title="System View of Loan Linking" />,
  },
  "floating-review": {
    title: "Floating Review Process",
    business: <DummyComponent title="Business View of Loan Linking" />,
    system: <DummyComponent title="System View of Loan Linking" />,
  },
  "daily-workplan": {
    title: "Agent Work Plan",
    business: <DummyComponent title="Business View of Loan Linking" />,
    system: <DummyComponent title="System View of Loan Linking" />,
  },
  "settlements-payment": {
    title: "Settlements - Payment",
    business: <DummyComponent title="Business View of Loan Linking" />,
    system: <DummyComponent title="System View of Loan Linking" />,
  },
  "settlements-waiveoff": {
    title: "Settlements - Waive Off",
    business: <DummyComponent title="Business View of Loan Linking" />,
    system: <DummyComponent title="System View of Loan Linking" />,
  },
  "eod-bod-process": {
    title: "EOD / BOD Process",
    business: <DummyComponent title="Business View of Loan Linking" />,
    system: <DummyComponent title="System View of Loan Linking" />,
  },
  "account-closure": {
    title: "Account Closure",
    business: <DummyComponent title="Business View of Loan Linking" />,
    system: <DummyComponent title="System View of Loan Linking" />,
  },
  "account-status": {
    title: "Account Status",
    business: <DummyComponent title="Business View of Loan Linking" />,
    system: <DummyComponent title="System View of Loan Linking" />,
  },
  "document-master": {
    title: "Document Master",
    business: <DummyComponent title="Business View of Loan Linking" />,
    system: <DummyComponent title="System View of Loan Linking" />,
  },
  "bulk-prepayment": {
    title: "Bulk Prepayment",
    business: <DummyComponent title="Business View of Loan Linking" />,
    system: <DummyComponent title="System View of Loan Linking" />,
  },
  "due-date-change": {
    title: "Due Date Change",
    business: <DummyComponent title="Business View of Loan Linking" />,
    system: <DummyComponent title="System View of Loan Linking" />,
  },
  "profit-rate-change": {
    title: "Profit Rate Change",
    business: <DummyComponent title="Business View of Loan Linking" />,
    system: <DummyComponent title="System View of Loan Linking" />,
  },
  "tenure-change": {
    title: "Tenure Change",
    business: <DummyComponent title="Business View of Loan Linking" />,
    system: <DummyComponent title="System View of Loan Linking" />,
  },
  "post-disbursal-edit": {
    title: "Post Disbursal Edit",
    business: <DummyComponent title="Business View of Loan Linking" />,
    system: <DummyComponent title="System View of Loan Linking" />,
  },
  "deferral-constitution": {
    title: "Deferral - Constitution Wise",
    business: <DummyComponent title="Business View of Loan Linking" />,
    system: <DummyComponent title="System View of Loan Linking" />,
  },
  "deferral-financewise": {
    title: "Deferral - Finance Wise",
    business: <DummyComponent title="Business View of Loan Linking" />,
    system: <DummyComponent title="System View of Loan Linking" />,
  },
  "deferral-portfolio": {
    title: "Deferral - Portfolio Wise",
    business: <DummyComponent title="Business View of Loan Linking" />,
    system: <DummyComponent title="System View of Loan Linking" />,
  },
};
