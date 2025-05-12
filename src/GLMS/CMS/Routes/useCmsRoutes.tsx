import React from "react";
import AllocationOfDelinquentCasesAllocationHold from "../Components/System/Allocation_of_Delinquent_Cases_Allocation_Hold";
import AllocationOfDelinquentCasesAllocationHoldBusiness from "../Components/Business/Allocation_of_Delinquent_Cases_Allocation_Hold_Business";
import DefineAllocationUseCase from "../Components/System/Define_Allocation_Use_Case";
import DefineAllocationUseCaseBusiness from "../Components/Business/Define_Allocation_Use_Case_Business";
import ManualAllocationUseCaseBusiness from "../Components/Business/Manual_Allocation_Use_Case_Business";
import ManualAllocationUseCase from "../Components/System/Manual_Allocation_Use_Case";
import ManualReallocationUseCase from "../Components/System/Manual_Reallocation_Use_Case";
import ManualReallocationUseCaseBusiness from "../Components/Business/Manual_Reallocation_Use_Case_Business";
import BeginningOfDayUseCase from "../Components/System/Beginning_of_Day_Use_Case";
import BeginningOfDayUseCaseBusiness from "../Components/Business/Beginning_of_Day_Use_Case_Business";
const DummyComponent: React.FC<{ title: string }> = ({ title }) => (
  <div className="p-4 bg-gray-100 text-center">{title} Component</div>
);

export const useCMSRoutes: Record<
  string,
  { title: string; business: JSX.Element; system: JSX.Element }
> = {
  "customer-id-creation": {
    title: "Allocation of Delinquent Cases_Allocation Hold",
    business: <AllocationOfDelinquentCasesAllocationHoldBusiness />,
    system: <AllocationOfDelinquentCasesAllocationHold />,
  },
  "co-applicant-linking": {
    title: "Allocation of Delinquent Cases_Define Allocation contract",
    business: <DefineAllocationUseCaseBusiness />,
    system: <DefineAllocationUseCase />,
  },
  "customer-id-loan-link": {
    title: "Allocation of Delinquent Cases_Manual Allocation",
    business: <ManualAllocationUseCaseBusiness />,
    system: <ManualAllocationUseCase />,
  },
  "loan-appraisal": {
    title: "Allocation of Delinquent Cases_Manual Reallocation",
    business: <ManualReallocationUseCaseBusiness />,
    system: <ManualReallocationUseCase />,
  },
  "loan-assessment": {
    title: "Beginning of Day Process",
    business: <BeginningOfDayUseCaseBusiness />,
    system: <BeginningOfDayUseCase />,
  },
  "recommendation-workflow": {
    title: "Classification of Delinquent Cases - Define Queue",
    business: <DummyComponent title="Business View of Loan Linking" />,
    system: <DummyComponent title="System View of Loan Linking" />,
  },
  "risk-analysis-upload": {
    title: "Contact Recording",
    business: <DummyComponent title="Business View of Loan Linking" />,
    system: <DummyComponent title="System View of Loan Linking" />,
  },
  "sanction-disbursement": {
    title: "Legal Collections Workflow",
    business: <DummyComponent title="Business View of Loan Linking" />,
    system: <DummyComponent title="System View of Loan Linking" />,
  },
  "loan-repayment-schedule": {
    title: "Prioritizing a Queue",
    business: <DummyComponent title="Business View of Loan Linking" />,
    system: <DummyComponent title="System View of Loan Linking" />,
  },
  "terms-conditions-workflow": {
    title: "Queue Communication Mapping",
    business: <DummyComponent title="Business View of Loan Linking" />,
    system: <DummyComponent title="System View of Loan Linking" />,
  },
  "asset-details-capture": {
    title: "Queue Curing",
    business: <DummyComponent title="Business View of Loan Linking" />,
    system: <DummyComponent title="System View of Loan Linking" />,
  },
  "limit-check-profile-update": {
    title: "Work Plan",
    business: <DummyComponent title="Business View of Loan Linking" />,
    system: <DummyComponent title="System View of Loan Linking" />,
  },
};
