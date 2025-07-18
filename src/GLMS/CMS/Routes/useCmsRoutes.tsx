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
  { title: string; business: JSX.Element; system: JSX.Element; image?: string }
> = {
  "allocation-hold": {
    title: "Allocation of Delinquent Cases_Allocation Hold",
    business: <AllocationOfDelinquentCasesAllocationHoldBusiness />,
    system: <AllocationOfDelinquentCasesAllocationHold />,
    image: "https://i.ibb.co/LD6k5ZYn/allocation-hold-for-delinquent-cases.png",
  },
  "define-allocation-contract": {
    title: "Allocation of Delinquent Cases_Define Allocation contract",
    business: <DefineAllocationUseCaseBusiness />,
    system: <DefineAllocationUseCase />,
    image: "",
  },
  "manual-allocation": {
    title: "Allocation of Delinquent Cases_Manual Allocation",
    business: <ManualAllocationUseCaseBusiness />,
    system: <ManualAllocationUseCase />,
    image: "https://i.ibb.co/hxHsM71w/manual-allocation.png",
  },
  "manual-reallocation": {
    title: "Allocation of Delinquent Cases_Manual Reallocation",
    business: <ManualReallocationUseCaseBusiness />,
    system: <ManualReallocationUseCase />,
    image: "https://i.ibb.co/RTzZPnrm/manual-recollection.png",
  },
  "bod-process": {
    title: "Beginning of Day Process",
    business: <BeginningOfDayUseCaseBusiness />,
    system: <BeginningOfDayUseCase />,
    image: "https://i.ibb.co/TyMnqfw/beggaining-of-day-process.png",
  },
  "define-queue": {
    title: "Classification of Delinquent Cases - Define Queue",
    business: <DefineQueueUseCaseBusiness />,
    system: <DefineQueueUseCase />,
    image: "https://i.ibb.co/Y4m7jf8K/defining-a-queue.png",
  },
  "contact-recording": {
    title: "Contact Recording",
    business: <ContactRecordingBusiness />,
    system: <ContactRecordingUseCase />,
    image: "https://i.ibb.co/4RBpJrcr/contact-recording.png",
  },
  "legal-collections": {
    title: "Legal Collections Workflow",
    business: <LegalCollectionsUseCaseBusiness />,
    system: <LegalCollectionsUseCase />,
    image: "https://i.ibb.co/knpXx2S/legal-collection-workflow.png",
  },
  "prioritize-queue": {
    title: "Prioritizing a Queue",
    business: <PrioritizeQueueUseCaseBusiness />,
    system: <PrioritizeQueueUseCase />,
    image: "https://i.ibb.co/mFzB0c2X/prioritizing-a-queue.png",
  },
  "communication-mapping": {
    title: "Queue Communication Mapping",
    business: <QueueCommunicationMappingUseCaseBusiness />,
    system: <QueueCommunicationMappingUseCase />,
    image: "https://i.ibb.co/v6qK9sbF/queue-communication-mapping.png",
  },
  "queue-curing": {
    title: "Queue Curing",
    business: <QueueCuringUseCaseBusiness />,
    system: <QueueCuringUseCase />,
    image: "",
  },
  "work-plan": {
    title: "Work Plan",
    business: <WorkPlanUseCaseBusiness />,
    system: <WorkPlanUseCase />,
    image: "https://i.ibb.co/Nd8gn6c9/Workplan.png",
  },
};
