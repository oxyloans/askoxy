import React from "react";
import CustomerCreationId from "../Components/CustomerCreationId";

// Dummy Components for remaining use cases
declare const DummyComponent: React.FC<{ title: string }>;
const createDummy = (title: string) => () =>
  <div className="p-4 bg-gray-100">{title} component</div>;

export const useCaseRoutes: Record<
  string,
  { title: string; component: JSX.Element }
> = {
  "customer-id-creation": {
    title: "Customer ID Creation",
    component: <CustomerCreationId />,
  },
  "document-upload": {
    title: "Document Upload",
    component: createDummy("Document Upload")(),
  },
  "kyc-verification": {
    title: "KYC Verification",
    component: createDummy("KYC Verification")(),
  },
  "credit-scoring": {
    title: "Credit Scoring",
    component: createDummy("Credit Scoring")(),
  },
  "loan-application": {
    title: "Loan Application",
    component: createDummy("Loan Application")(),
  },
  "sanction-letter": {
    title: "Sanction Letter Generation",
    component: createDummy("Sanction Letter Generation")(),
  },
  "loan-agreement-upload": {
    title: "Loan Agreement Upload",
    component: createDummy("Loan Agreement Upload")(),
  },
  "disbursement-tracking": {
    title: "Disbursement Tracking",
    component: createDummy("Disbursement Tracking")(),
  },
  "repayment-schedule": {
    title: "Repayment Schedule",
    component: createDummy("Repayment Schedule")(),
  },
  "delinquency-monitoring": {
    title: "Delinquency Monitoring",
    component: createDummy("Delinquency Monitoring")(),
  },
  "customer-support": {
    title: "Customer Support",
    component: createDummy("Customer Support")(),
  },
  "profile-update": {
    title: "Profile Update",
    component: createDummy("Profile Update")(),
  },
  "account-closure": {
    title: "Account Closure",
    component: createDummy("Account Closure")(),
  },
};
