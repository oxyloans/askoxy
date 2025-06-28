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
  Send,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface WF_for_Sanction_Letter_Generation_Customer_ResponseProps {}

const WF_for_Sanction_Letter_Generation_Customer_Response: React.FC<
  WF_for_Sanction_Letter_Generation_Customer_ResponseProps
> = () => {
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
            Sanction Letter Generation & Customer Response in LOS
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
                This use case enables the Bank Officer to generate a Sanction or Rejection letter after the sanctioning authority’s decision and facilitates capturing the Customer’s response in the system. Based on acceptance, the process for opening the loan account is initiated in the Core Banking System (CBS).
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
                  <h3 className="font-medium text-gray-800 mb-2 text-base">Customer-facing</h3>
                  <ul className="list-disc pl-5 text-gray-600 text-base">
                    <li>Bank Officer</li>
                    <li>Customer</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2 text-base">System Roles & Stakeholders</h3>
                  <ul className="list-disc pl-5 text-gray-600 text-base">
                    <li>Loan Origination System (LOS)</li>
                    <li>Core Banking System (CBS)</li>
                    <li>API Developer</li>
                    <li>QA</li>
                    <li>Infra</li>
                    <li>Product Owner</li>
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
                  <strong>User Action:</strong> Bank Officer logs into LOS.<br />
                  <strong>System Response:</strong> System authenticates the Bank Officer and grants access to LOS.
                </li>
                <li>
                  <strong>User Action:</strong> Loan Proposal is approved/rejected by authority.<br />
                  <strong>System Response:</strong> LOS updates the loan proposal status to approved or rejected.
                </li>
                <li>
                  <strong>User Action:</strong> Bank Officer initiates Sanction Letter generation.<br />
                  <strong>System Response:</strong> LOS generates a Sanction or Rejection letter based on the proposal status.
                </li>
                <li>
                  <strong>User Action:</strong> Bank Officer reviews and confirms letter contents.<br />
                  <strong>System Response:</strong> LOS saves the confirmed letter content.
                </li>
                <li>
                  <strong>User Action:</strong> Letter is shared with Customer (email/print).<br />
                  <strong>System Response:</strong> LOS sends the letter via email or marks it for printing.
                </li>
                <li>
                  <strong>User Action:</strong> Customer responds with Acceptance or Rejection.<br />
                  <strong>System Response:</strong> LOS records the Customer’s response.
                </li>
                <li>
                  <strong>User Action:</strong> If Accepted, Bank Officer triggers Loan Account creation in CBS.<br />
                  <strong>System Response:</strong> LOS initiates loan account creation via CBS API.
                </li>
                <li>
                  <strong>User Action:</strong> System confirms loan account created.<br />
                  <strong>System Response:</strong> Status updated in LOS for tracking.
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
                    <li>Loan proposal already approved/rejected by sanctioning authority</li>
                    <li>All mandatory fields and verification steps completed in LOS</li>
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
                    <li>Customer response (Accepted/Rejected) is recorded</li>
                    <li>If accepted, loan account creation is triggered in CBS</li>
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
                Approval → Letter Generated → Shared with Customer → Response Captured → Loan Account Opened (CBS)
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
        <li>Letter delivered via App/Email/Branch</li>
        <li>Customer responds online/offline</li>
        <li>Auto-scheduling for CBS integration on acceptance</li>
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
                <li>Letter not delivered (email bounce/technical issue)</li>
                <li>Customer does not respond within timeline</li>
                <li>CBS API failure during account creation</li>
                <li>Manual override required for sanction changes</li>
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
                Start → [Loan Approved/Rejected] → [Generate Letter in LOS] → [Send to Customer] → [Capture Response] → [If Accepted → Create Loan A/C in CBS] → End
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
                Parking Lot
              </span>
              {expandedSections.parkingLot ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.parkingLot && (
              <ul id="parkingLot-section" className="list-disc pl-5 text-gray-600 text-base">
                <li>Option for digital signature by Customer</li>
                <li>Auto-reminders if Customer hasn’t responded</li>
                <li>Integration with customer portal for self-service</li>
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
                <li>LOS Frontend (UI)</li>
                <li>Sanction Letter Generator Module</li>
                <li>LOS DB</li>
                <li>CBS API (Loan Account Creation)</li>
                <li>Notification Service (SMS/Email)</li>
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
                <li>Sanction Letter Generated for approved proposal</li>
                <li>Letter Rejection flow</li>
                <li>Customer response recorded correctly</li>
                <li>Failure in CBS account creation</li>
                <li>Load test for bulk letter generation</li>
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
                <li>LOS-CBS API latency</li>
                <li>Email server dependency</li>
                <li>Retry logic for failed CBS integration</li>
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
                <li><strong>Squad:</strong> LOS Core Processing</li>
                <li><strong>Contact:</strong> LOS Module Lead</li>
                <li><strong>Jira:</strong> LOS-1278</li>
                <li><strong>Git Repo:</strong> /los-core/sanction-letter-service</li>
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default WF_for_Sanction_Letter_Generation_Customer_Response;