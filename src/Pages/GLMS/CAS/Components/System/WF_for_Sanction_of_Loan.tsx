import React, { useState } from "react";
import {
  FileText,
  Users,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Info,
  List,
  Server,
  GitBranch,
  Code,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface WF_for_Sanction_of_LoanProps {}

const WF_for_Sanction_of_Loan: React.FC<WF_for_Sanction_of_LoanProps> = () => {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    description: true,
    actors: true,
    userActions: true,
    precondition: true,
    postcondition: true,
    stp: true,
    alternativeFlows: true,
    exceptionFlows: true,
    activityDiagram: true,
    parkingLot: true,
    systemComponents: true,
    testScenarios: true,
    infra: true,
    devTeam: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 border-b-2 border-blue-600 pb-4 text-center sm:text-left">
            Sanction of Loan in LOS
          </h1>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Description */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("description")}
              aria-expanded={expandedSections.description}
              aria-controls="description-section"
            >
              <span className="flex items-center">
                <Info size={20} className="mr-2 text-blue-600" />
                Description
              </span>
              {expandedSections.description ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.description && (
              <p id="description-section" className="text-gray-600 leading-relaxed text-base">
                This use case describes the process of loan proposal sanctioning, which includes capturing customer details, generating appraisal notes, validating the proposal through the Sanctioning Authority, and handling clarifications and decisions (approval/rejection). The final decision is recorded in the Loan Origination System (LOS), and the Bank Officer proceeds with post-sanction activities.
              </p>
            )}
          </section>

          {/* Actors */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("actors")}
              aria-expanded={expandedSections.actors}
              aria-controls="actors-section"
            >
              <span className="flex items-center">
                <Users size={20} className="mr-2 text-blue-600" />
                Actors
              </span>
              {expandedSections.actors ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.actors && (
              <div id="actors-section" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-800 mb-2 text-base">Primary Actors</h3>
                  <ul className="list-disc pl-5 text-gray-600 text-base">
                    <li>Bank Officer - Prepares the proposal and coordinates for discrepancy resolution</li>
                    <li>Sanctioning Authority - Reviews and decides on loan proposal</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2 text-base">System Actors</h3>
                  <ul className="list-disc pl-5 text-gray-600 text-base">
                    <li>LOS (Loan Origination System)</li>
                    <li>Notification Service</li>
                  </ul>
                </div>
              </div>
            )}
          </section>

          {/* User Actions & System Responses */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("userActions")}
              aria-expanded={expandedSections.userActions}
              aria-controls="userActions-section"
            >
              <span className="flex items-center">
                <ChevronRight size={20} className="mr-2 text-blue-600" />
                User Actions & System Responses
              </span>
              {expandedSections.userActions ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.userActions && (
              <ol id="userActions-section" className="list-decimal pl-5 text-gray-600 text-base space-y-4">
                <li>
                  <strong>User Action:</strong> Bank Officer enters customer details.<br />
                  <strong>System Response:</strong> System stores customer profile and links to loan proposal.
                </li>
                <li>
                  <strong>User Action:</strong> Bank Officer prepares loan proposal.<br />
                  <strong>System Response:</strong> LOS calculates eligibility and proposed loan.
                </li>
                <li>
                  <strong>User Action:</strong> Officer prepares Appraisal Note/Process Note.<br />
                  <strong>System Response:</strong> System generates draft appraisal documents.
                </li>
                <li>
                  <strong>User Action:</strong> Risk analysis and T&C are finalized and proposal is submitted.<br />
                  <strong>System Response:</strong> Proposal forwarded to Sanctioning Authority via workflow.
                </li>
                <li>
                  <strong>User Action:</strong> Sanctioning Authority reviews proposal.<br />
                  <strong>System Response:</strong> System provides view of all notes, risks, and conditions.
                </li>
                <li>
                  <strong>User Action:</strong> If complete, Authority approves/rejects loan.<br />
                  <strong>System Response:</strong> Decision updated in LOS.
                </li>
                <li>
                  <strong>User Action:</strong> If discrepancy found, Authority comments and sends back.<br />
                  <strong>System Response:</strong> System notifies Bank Officer with remarks.
                </li>
                <li>
                  <strong>User Action:</strong> Bank Officer collects additional info/reports.<br />
                  <strong>System Response:</strong> Updated documents uploaded in LOS.
                </li>
                <li>
                  <strong>User Action:</strong> Revised proposal resubmitted.<br />
                  <strong>System Response:</strong> System notifies Sanctioning Authority.
                </li>
                <li>
                  <strong>User Action:</strong> Final review by Authority.<br />
                  <strong>System Response:</strong> Approves with/without conditions or rejects.
                </li>
                <li>
                  <strong>User Action:</strong> Officer is notified and proceeds with next steps.<br />
                  <strong>System Response:</strong> Decision recorded in LOS.
                </li>
              </ol>
            )}
          </section>

          {/* Precondition & Post Condition */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <button
                  className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
                  onClick={() => toggleSection("precondition")}
                  aria-expanded={expandedSections.precondition}
                  aria-controls="precondition-section"
                >
                  <span className="flex items-center">
                    <CheckCircle size={20} className="mr-2 text-green-600" />
                    Precondition
                  </span>
                  {expandedSections.precondition ? (
                    <ChevronUp size={20} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-600" />
                  )}
                </button>
                {expandedSections.precondition && (
                  <ul id="precondition-section" className="list-disc pl-5 text-gray-600 text-base">
                    <li>Customer ID and loan account created</li>
                    <li>All mandatory customer, loan, and risk data entered in LOS</li>
                    <li>Appraisal and process notes completed</li>
                  </ul>
                )}
              </div>
              <div>
                <button
                  className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
                  onClick={() => toggleSection("postcondition")}
                  aria-expanded={expandedSections.postcondition}
                  aria-controls="postcondition-section"
                >
                  <span className="flex items-center">
                    <CheckCircle size={20} className="mr-2 text-green-600" />
                    Post Condition
                  </span>
                  {expandedSections.postcondition ? (
                    <ChevronUp size={20} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-600" />
                  )}
                </button>
                {expandedSections.postcondition && (
                  <ul id="postcondition-section" className="list-disc pl-5 text-gray-600 text-base">
                    <li>Sanctioning Authority’s decision recorded in LOS</li>
                    <li>Bank Officer is notified of approval or rejection</li>
                    <li>Sanction letter preparation process may begin</li>
                  </ul>
                )}
              </div>
            </div>
          </section>

          {/* Straight Through Process (STP) */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("stp")}
              aria-expanded={expandedSections.stp}
              aria-controls="stp-section"
            >
              <span className="flex items-center">
                <FileText size={20} className="mr-2 text-blue-600" />
                Straight Through Process (STP)
              </span>
              {expandedSections.stp ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.stp && (
              <p id="stp-section" className="text-gray-600 text-base">
                Customer details → Appraisal Note → Approval → Decision updated
              </p>
            )}
          </section>

          {/* Alternative Flows */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("alternativeFlows")}
              aria-expanded={expandedSections.alternativeFlows}
              aria-controls="alternativeFlows-section"
            >
              <span className="flex items-center">
                <ChevronRight size={20} className="mr-2 text-blue-600" />
                Alternative Flows
              </span>
              {expandedSections.alternativeFlows ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.alternativeFlows && (
              <ul id="alternativeFlows-section" className="list-disc pl-5 text-gray-600 text-base">
                <li>Proposal returned with discrepancies → Officer updates → Resubmission</li>
                <li>Conditional approval requiring additional covenants</li>
              </ul>
            )}
          </section>

          {/* Exception Flows */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("exceptionFlows")}
              aria-expanded={expandedSections.exceptionFlows}
              aria-controls="exceptionFlows-section"
            >
              <span className="flex items-center">
                <AlertCircle size={20} className="mr-2 text-red-600" />
                Exception Flows
              </span>
              {expandedSections.exceptionFlows ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.exceptionFlows && (
              <ul id="exceptionFlows-section" className="list-disc pl-5 text-gray-600 text-base">
                <li>Incomplete customer documentation</li>
                <li>System errors in LOS during workflow submission</li>
                <li>Delay in receiving response from customer or departments</li>
              </ul>
            )}
          </section>

          {/* User Activity Diagram */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("activityDiagram")}
              aria-expanded={expandedSections.activityDiagram}
              aria-controls="activityDiagram-section"
            >
              <span className="flex items-center">
                <List size={20} className="mr-2 text-blue-600" />
                User Activity Diagram (Flowchart)
              </span>
              {expandedSections.activityDiagram ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.activityDiagram && (
              <p id="activityDiagram-section" className="text-gray-600 text-base">
                Start → [Customer Details Entered in LOS] → [Loan Proposal Prepared] → [Proposal Sent to Sanctioning Authority] → [Authority Reviews Proposal] → [If Discrepancy → Comments Sent to Officer → Officer Updates Info → Resubmits Proposal] → [Final Approval/Rejection] → [Decision Updated in LOS] → End
              </p>
            )}
          </section>

          {/* Parking Lot */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("parkingLot")}
              aria-expanded={expandedSections.parkingLot}
              aria-controls="parkingLot-section"
            >
              <span className="flex items-center">
                <Info size={20} className="mr-2 text-blue-600" />
                Parking Lot (Future Enhancements)
              </span>
              {expandedSections.parkingLot ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.parkingLot && (
              <ul id="parkingLot-section" className="list-disc pl-5 text-gray-600 text-base">
                <li>Auto-notification to customer on sanction status</li>
                <li>Dashboard for Sanctioning Authority on pending proposals</li>
                <li>SLA tracking between Officer and Authority</li>
              </ul>
            )}
          </section>

          {/* System Components Involved */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("systemComponents")}
              aria-expanded={expandedSections.systemComponents}
              aria-controls="systemComponents-section"
            >
              <span className="flex items-center">
                <Server size={20} className="mr-2 text-blue-600" />
                System Components Involved
              </span>
              {expandedSections.systemComponents ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.systemComponents && (
              <ul id="systemComponents-section" className="list-disc pl-5 text-gray-600 text-base">
                <li>LOS UI for Bank Officer and Sanctioning Authority</li>
                <li>LOS Workflow Engine</li>
                <li>Document Upload & Versioning</li>
                <li>Notification Service (Email/Alerts)</li>
                <li>LOS Database</li>
              </ul>
            )}
          </section>

          {/* Test Scenarios */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("testScenarios")}
              aria-expanded={expandedSections.testScenarios}
              aria-controls="testScenarios-section"
            >
              <span className="flex items-center">
                <Code size={20} className="mr-2 text-blue-600" />
                Test Scenarios
              </span>
              {expandedSections.testScenarios ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.testScenarios && (
              <ul id="testScenarios-section" className="list-disc pl-5 text-gray-600 text-base">
                <li>Proposal successfully sanctioned</li>
                <li>Proposal rejected with comments</li>
                <li>Proposal returned for clarification and re-approved</li>
                <li>Proposal not submitted due to missing mandatory fields</li>
                <li>Failure in system notification delivery</li>
              </ul>
            )}
          </section>

          {/* Infra & Deployment Notes */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("infra")}
              aria-expanded={expandedSections.infra}
              aria-controls="infra-section"
            >
              <span className="flex items-center">
                <Server size={20} className="mr-2 text-blue-600" />
                Infra & Deployment Notes
              </span>
              {expandedSections.infra ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.infra && (
              <ul id="infra-section" className="list-disc pl-5 text-gray-600 text-base">
                <li>Proposal attachments (Appraisal note, Risk Reports) must be accessible</li>
                <li>Notification queues must be monitored for delayed message delivery</li>
                <li>Role-based access: Bank Officer cannot override Authority’s decision</li>
              </ul>
            )}
          </section>

          {/* Dev Team Ownership */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("devTeam")}
              aria-expanded={expandedSections.devTeam}
              aria-controls="devTeam-section"
            >
              <span className="flex items-center">
                <GitBranch size={20} className="mr-2 text-blue-600" />
                Dev Team Ownership
              </span>
              {expandedSections.devTeam ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.devTeam && (
              <ul id="devTeam-section" className="list-disc pl-5 text-gray-600 text-base">
                <li><strong>Squad:</strong> LOS Workflow Engine</li>
                <li><strong>Contact:</strong> Process Automation Lead</li>
                <li><strong>Git Repo:</strong> /los-core/loan-sanction-module</li>
                <li><strong>Jira Ref:</strong> LOS-2105</li>
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default WF_for_Sanction_of_Loan;