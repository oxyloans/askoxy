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
import ContactRecordingBusiness from "../Components/Business/Contact_Recording_Business";
import ContactRecordingUseCase from "../Components/System/Contact_Recording_Use_Case";
import DefineQueueUseCase from "../Components/System/Define_Queue_Use_CaseProps";
import DefineQueueUseCaseBusiness from "../Components/Business/Define_Queue_Use_Case_Business";
import LegalCollectionsUseCase from "../Components/System/Legal_Collections_Use_Case";
import LegalCollectionsUseCaseBusiness from "../Components/Business/Legal_Collections_Use_Case_Business";
import PrioritizeQueueUseCase from "../Components/System/Prioritize_Queue_Use_Case";
import PrioritizeQueueUseCaseBusiness from "../Components/Business/Prioritize_Queue_Use_Case_Business";
import QueueCommunicationMappingUseCaseBusiness from "../Components/Business/Queue_Communication_Mapping_Use_Case_Business";
import QueueCommunicationMappingUseCase from "../Components/System/Queue_Communication_Mapping_Use_Case";
import QueueCuringUseCase from "../Components/System/Queue_Curing_Use_CaseProps";
import QueueCuringUseCaseBusiness from "../Components/Business/Queue_Curing_Use_Case_Business";
import WorkPlanUseCaseBusiness from "../Components/Business/WorkPlan_Use_Case_Business";
import WorkPlanUseCase from "../Components/System/Work_Plan_Use_Case";

// const DummyComponent: React.FC<{ title: string }> = ({ title }) => (
//   <div className="p-4 bg-gray-100 text-center">{title} Component</div>
// );

export const useCMSRoutes: Record<
  string,
  { title: string; business: JSX.Element; system: JSX.Element }
> = {
  "allocation-hold": {
    title: "Allocation of Delinquent Cases_Allocation Hold",
    business: <AllocationOfDelinquentCasesAllocationHoldBusiness />,
    system: <AllocationOfDelinquentCasesAllocationHold />,
  },
  "define-allocation-contract": {
    title: "Allocation of Delinquent Cases_Define Allocation contract",
    business: <DefineAllocationUseCaseBusiness />,
    system: <DefineAllocationUseCase />,
  },
  "manual-allocation": {
    title: "Allocation of Delinquent Cases_Manual Allocation",
    business: <ManualAllocationUseCaseBusiness />,
    system: <ManualAllocationUseCase />,
  },
  "manual-reallocation": {
    title: "Allocation of Delinquent Cases_Manual Reallocation",
    business: <ManualReallocationUseCaseBusiness />,
    system: <ManualReallocationUseCase />,
  },
  "bod-process": {
    title: "Beginning of Day Process",
    business: <BeginningOfDayUseCaseBusiness />,
    system: <BeginningOfDayUseCase />,
  },
  "define-queue": {
    title: "Classification of Delinquent Cases - Define Queue",
    business: <DefineQueueUseCaseBusiness />,
    system: <DefineQueueUseCase />,
  },
  "contact-recording": {
    title: "Contact Recording",
    business: <ContactRecordingBusiness />,
    system: <ContactRecordingUseCase />,
  },
  "legal-collections": {
    title: "Legal Collections Workflow",
    business: <LegalCollectionsUseCaseBusiness />,
    system: <LegalCollectionsUseCase />,
  },
  "prioritize-queue": {
    title: "Prioritizing a Queue",
    business: <PrioritizeQueueUseCaseBusiness />,
    system: <PrioritizeQueueUseCase />,
  },
  "communication-mapping": {
    title: "Queue Communication Mapping",
    business: <QueueCommunicationMappingUseCaseBusiness />,
    system: <QueueCommunicationMappingUseCase />,
  },
  "queue-curing": {
    title: "Queue Curing",
    business: <QueueCuringUseCaseBusiness />,
    system: <QueueCuringUseCase />,
  },
  "work-plan": {
    title: "Work Plan",
    business: <WorkPlanUseCaseBusiness />,
    system: <WorkPlanUseCase />,
  },
};
