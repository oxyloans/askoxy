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
  Code,
  GitBranch,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Beginning_of_Day_Use_CaseProps {}

const Beginning_of_Day_Use_Case: React.FC<
  Beginning_of_Day_Use_CaseProps
> = () => {
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    description: true,
    actors: true,
    userActions: true,
    precondition: true,
    postCondition: true,
    stp: true,
    alternativeFlows: true,
    exceptionFlows: true,
    flowchart: true,
    parkingLot: true,
    systemComponents: true,
    testScenarios: true,
    infraNotes: true,
    devTeam: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <div className="mb-10">
          <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 border-b-2 border-blue-600 pb-4 text-center sm:text-left">
            Beginning of Day (BOD) Process
          </h1>
        </div>

        {/* Content Sections */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 space-y-8">
          {/* Description */}
          <section>
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
              <p
                id="description-section"
                className="text-gray-700 leading-relaxed text-base"
              >
                The Beginning of Day (BOD) Process is a daily operation within
                the Collections Management System designed to retrieve and
                update delinquent and non-delinquent account data from the
                backend database. This data is sourced from the Collections
                Management Application and is essential for the classification
                and follow-up of delinquent accounts. The BOD process is
                initiated manually by the user.
              </p>
            )}
          </section>

          {/* Actors */}
          <section>
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
              <div
                id="actors-section"
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">
                    Business User
                  </h3>
                  <ul className="list-disc pl-5 text-gray-700 text-base">
                    <li>Collections System Operator</li>
                  </ul>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">
                    System Roles
                  </h3>
                  <ul className="list-disc pl-5 text-gray-700 text-base">
                    <li>Collections Management System</li>
                  </ul>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">
                    Stakeholders
                  </h3>
                  <ul className="list-disc pl-5 text-gray-700 text-base">
                    <li>Collections Department</li>
                    <li>Risk Team</li>
                    <li>Operations</li>
                  </ul>
                </div>
              </div>
            )}
          </section>

          {/* User Actions & System Responses */}
          <section>
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("userActions")}
              aria-expanded={expandedSections.userActions}
              aria-controls="user-actions-section"
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
              <ol
                id="user-actions-section"
                className="list-decimal pl-5 text-gray-700 text-base space-y-2"
              >
                <li>User logs into the Collections Management Application.</li>
                <li>Navigates to the BOD Process screen.</li>
                <li>
                  Selects the Line of Business (e.g., Credit Card, Overdraft,
                  Finance Loan).
                </li>
                <li>Submits request to initiate BOD process.</li>
                <li>
                  System retrieves and displays details for each delinquent and
                  non-delinquent customer, including:
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <ul className="list-disc pl-5">
                      <li>Total Loan Amount</li>
                      <li>Outstanding Loan Amount</li>
                      <li>Customer/Co-applicant/Guarantor Information</li>
                    </ul>
                    <ul className="list-disc pl-5">
                      <li>Due Date and Due Amount</li>
                      <li>Customer Contact Details</li>
                    </ul>
                  </div>
                </li>
                <li>
                  User reviews retrieved data and proceeds to delinquency
                  classification.
                </li>
              </ol>
            )}
          </section>

          {/* Precondition */}
          <section>
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
              <ul
                id="precondition-section"
                className="list-disc pl-5 text-gray-700 text-base"
              >
                <li>
                  Database must contain updated information on delinquent and
                  non-delinquent accounts.
                </li>
              </ul>
            )}
          </section>

          {/* Post Condition */}
          <section>
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("postCondition")}
              aria-expanded={expandedSections.postCondition}
              aria-controls="post-condition-section"
            >
              <span className="flex items-center">
                <CheckCircle size={20} className="mr-2 text-green-600" />
                Post Condition
              </span>
              {expandedSections.postCondition ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.postCondition && (
              <ul
                id="post-condition-section"
                className="list-disc pl-5 text-gray-700 text-base"
              >
                <li>
                  System displays delinquent case details, and user transitions
                  to the classification process.
                </li>
              </ul>
            )}
          </section>

          {/* Straight Through Process (STP) */}
          <section>
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("stp")}
              aria-expanded={expandedSections.stp}
              aria-controls="stp-section"
            >
              <span className="flex items-center">
                <List size={20} className="mr-2 text-blue-600" />
                Straight Through Process (STP)
              </span>
              {expandedSections.stp ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.stp && (
              <p
                id="stp-section"
                className="text-gray-700 leading-relaxed text-base"
              >
                Login → Navigate to BOD Process Screen → Select Line of Business
                → Submit → View Delinquency Data → Proceed to Classification
              </p>
            )}
          </section>

          {/* Alternative Flows */}
          <section>
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("alternativeFlows")}
              aria-expanded={expandedSections.alternativeFlows}
              aria-controls="alternative-flows-section"
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
              <ul
                id="alternative-flows-section"
                className="list-disc pl-5 text-gray-700 text-base"
              >
                <li>
                  Data retrieval failure due to connectivity or database issues.
                </li>
                <li>User initiates BOD for an unsupported Line of Business.</li>
              </ul>
            )}
          </section>

          {/* Exception Flows */}
          <section>
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("exceptionFlows")}
              aria-expanded={expandedSections.exceptionFlows}
              aria-controls="exception-flows-section"
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
              <ul
                id="exception-flows-section"
                className="list-disc pl-5 text-gray-700 text-base"
              >
                <li>Missing data for selected Line of Business.</li>
                <li>System timeout or failure during fetch.</li>
              </ul>
            )}
          </section>

          {/* User Activity Diagram (Flowchart) */}
          <section>
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("flowchart")}
              aria-expanded={expandedSections.flowchart}
              aria-controls="flowchart-section"
            >
              <span className="flex items-center">
                <List size={20} className="mr-2 text-blue-600" />
                User Activity Diagram (Flowchart)
              </span>
              {expandedSections.flowchart ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.flowchart && (
              <pre
                id="flowchart-section"
                className="bg-gray-100 p-4 rounded-lg text-base text-gray-700 font-mono overflow-x-auto border border-gray-200"
              >
                {`
Start
   |
   v
Login
   |
   v
Open BOD Process Screen
   |
   v
Select Line of Business
   |
   v
Submit
   |
   v
View Customer Details
   |
   v
Proceed to Classification
   |
   v
End
                  `}
              </pre>
            )}
          </section>

          {/* Parking Lot */}
          <section>
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("parkingLot")}
              aria-expanded={expandedSections.parkingLot}
              aria-controls="parking-lot-section"
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
              <ul
                id="parking-lot-section"
                className="list-disc pl-5 text-gray-700 text-base"
              >
                <li>Automate BOD process via scheduled batch job.</li>
                <li>
                  Dashboard to visualize BOD execution status and exceptions.
                </li>
              </ul>
            )}
          </section>

          {/* System Components Involved */}
          <section>
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("systemComponents")}
              aria-expanded={expandedSections.systemComponents}
              aria-controls="system-components-section"
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
              <ul
                id="system-components-section"
                className="list-disc pl-5 text-gray-700 text-base"
              >
                <li>UI: BOD Processing Screen</li>
                <li>
                  DB Tables: Customer Info, Loan Details, Delinquency Records
                </li>
                <li>APIs: Data Fetch API, Classification Trigger</li>
                <li>Services: BOD Scheduler, Audit Logger</li>
              </ul>
            )}
          </section>

          {/* Test Scenarios */}
          <section>
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("testScenarios")}
              aria-expanded={expandedSections.testScenarios}
              aria-controls="test-scenarios-section"
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
              <ul
                id="test-scenarios-section"
                className="list-disc pl-5 text-gray-700 text-base"
              >
                <li>Run BOD for each Line of Business successfully.</li>
                <li>Simulate missing data and verify error handling.</li>
                <li>Confirm UI displays all expected customer details.</li>
              </ul>
            )}
          </section>

          {/* Infra & Deployment Notes */}
          <section>
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("infraNotes")}
              aria-expanded={expandedSections.infraNotes}
              aria-controls="infra-notes-section"
            >
              <span className="flex items-center">
                <Server size={20} className="mr-2 text-blue-600" />
                Infra & Deployment Notes
              </span>
              {expandedSections.infraNotes ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.infraNotes && (
              <ul
                id="infra-notes-section"
                className="list-disc pl-5 text-gray-700 text-base"
              >
                <li>Ensure BOD fetch job has DB read permissions.</li>
                <li>System load optimization to handle early-day traffic.</li>
              </ul>
            )}
          </section>

          {/* Dev Team Ownership */}
          <section>
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("devTeam")}
              aria-expanded={expandedSections.devTeam}
              aria-controls="dev-team-section"
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
              <ul
                id="dev-team-section"
                className="list-disc pl-5 text-gray-700 text-base"
              >
                <li>Squad: Collections Process Team</li>
                <li>Contact: Lead Dev - bod_support@bankdomain.com</li>
                <li>JIRA: COLL-BOD-INIT-01</li>
                <li>Git Repo: /collections/bod-process</li>
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default Beginning_of_Day_Use_Case;
