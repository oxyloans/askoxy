import React from "react";

// Dummy Components for use cases
declare const DummyComponent: React.FC<{ title: string }>;
const createDummy = (title: string) => () =>
  <div className="p-4 bg-gray-100">{title} component</div>;

export const useCMSRoutes: Record<
  string,
  { title: string; component: JSX.Element }
> = {
  "customer-id-creation": {
    title: "Allocation of Delinquent Cases_Allocation Hold",
    component: createDummy("Generate unique customer ID and link it to CBS")(),
  },
  "co-applicant-linking": {
    title: "Allocation of Delinquent Cases_Define Allocation contract",
    component: createDummy("Upload and link KYC/supporting documents")(),
  },
  "customer-id-loan-link": {
    title: "Allocation of Delinquent Cases_Manual Allocation",
    component: createDummy("Map customer ID to loan application")(),
  },
  "loan-appraisal": {
    title: "Allocation of Delinquent Cases_Manual Reallocation",
    component: createDummy("Perform customer credit scoring and appraisal")(),
  },
  "loan-assessment": {
    title: "Beginning of Day Process",
    component: createDummy("Capture application and do preliminary checks")(),
  },
  "recommendation-workflow": {
    title: "Classification of Delinquent Cases - Define Queue",
    component: createDummy("Generate sanction recommendations")(),
  },
  "risk-analysis-upload": {
    title: "Contact Recording",
    component: createDummy("Upload signed agreements and validate risk")(),
  },
  "sanction-disbursement": {
    title: "Legal Collections Workflow",
    component: createDummy("Track sanction status and acknowledgment")(),
  },
  "loan-repayment-schedule": {
    title: "Prioritizing a Queue",
    component: createDummy("Generate EMI and track repayments")(),
  },
  "terms-conditions-workflow": {
    title: "Queue Communication Mapping",
    component: createDummy("Approve/manage loan terms & agreements")(),
  },
  "asset-details-capture": {
    title: "Queue Curing",
    component: createDummy("Record asset details for collateral")(),
  },
  "limit-check-profile-update": {
    title: "Work Plan",
    component: createDummy("Update profile and check credit limits")(),
  },
};
