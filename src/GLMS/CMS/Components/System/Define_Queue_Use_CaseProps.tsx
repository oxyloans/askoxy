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

interface Define_Queue_Use_CaseProps {}

const Define_Queue_Use_Case: React.FC<Define_Queue_Use_CaseProps> = () => {
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
            Classification of Delinquent Cases - Define Queue
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
                The "Define Queue" functionality is part of the classification
                process within the Collections System. Once the Beginning of Day
                (BOD) process is completed, users can define queues and map them
                to classification rules for delinquent customers. This
                categorization is essential for effective collection strategies,
                as it allows collectors to prioritize and handle cases based on
                severity, financial status, and business rules.
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
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">
                    Business User
                  </h3>
                  <ul className="list-disc pl-5 text-gray-700 text-base">
                    <li>Collections Admin/Supervisor</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">
                    System Roles
                  </h3>
                  <ul className="list-disc pl-5 text-gray-700 text-base">
                    <li>Collections Management System</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">
                    Stakeholders
                  </h3>
                  <ul className="list-disc pl-5 text-gray-700 text-base">
                    <li>Collections Department</li>
                    <li>Risk Management</li>
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
                <li>User logs into the Collections System post-BOD.</li>
                <li>Navigates to the Queue Definition section.</li>
                <li>
                  Inputs the following details:
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <ul className="list-disc pl-5">
                      <li>Strategy</li>
                      <li>Financier</li>
                      <li>Financier Type</li>
                      <li>Queue Code</li>
                      <li>Rule Code</li>
                    </ul>
                    <ul className="list-disc pl-5">
                      <li>Severity</li>
                      <li>Execution Sequence</li>
                      <li>Maker ID</li>
                      <li>Making Date</li>
                    </ul>
                  </div>
                </li>
                <li>System validates the inputs.</li>
                <li>
                  User maps the defined queue to a classification rule based on
                  product and financier.
                </li>
                <li>Provides a description for the queue.</li>
                <li>Saves the details.</li>
                <li>System confirms successful queue creation and mapping.</li>
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
                <li>Completion of the BOD process.</li>
                <li>
                  Availability of delinquent and non-delinquent customer data in
                  the database.
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
                  Queue and classification rule mapping stored in the system.
                </li>
                <li>Cases are ready for allocation based on defined rules.</li>
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
                Login → Access Queue Definition → Input Parameters → Map to Rule
                → Save → Queue Confirmation
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
                <li>Queue update or redefinition if rules change.</li>
                <li>
                  Parallel definition of multiple queues for various products.
                </li>
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
                <li>Invalid input format or missing mandatory fields.</li>
                <li>Attempt to map to a non-existent rule.</li>
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
Access Queue Definition
   |
   v
Enter Details
   |
   v
Map Rule
   |
   v
Provide Description
   |
   v
Save
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
                <li>Feature to bulk import queue definitions.</li>
                <li>Dynamic rule validation against delinquency trends.</li>
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
                <li>UI: Queue Definition Form</li>
                <li>DB Tables: Queue Setup, Rule Mapping, Product Info</li>
                <li>APIs: Rule Validator, Queue Saver</li>
                <li>Services: Classification Engine, Audit Logger</li>
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
                <li>Successful creation of a queue and mapping.</li>
                <li>Missing mandatory field validation.</li>
                <li>Duplicate queue code handling.</li>
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
                <li>Ensure real-time syncing of rules for accurate mapping.</li>
                <li>Secure access controls for queue configuration.</li>
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
                <li>Squad: Collections Configuration Team</li>
                <li>Contact: Lead Dev - queue_support@bankdomain.com</li>
                <li>JIRA: COLL-QUEUE-DEFINE-01</li>
                <li>Git Repo: /collections/queue-definition</li>
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default Define_Queue_Use_Case;
