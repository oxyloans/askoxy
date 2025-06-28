import React, { useState } from "react";
import {
  FileText,
  Users,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Info,
  List,
  Lock,
  GitBranch,
  Server,
  Code,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Manual_Reallocation_Use_CaseProps {}

const Manual_Reallocation_Use_Case: React.FC<Manual_Reallocation_Use_CaseProps> = () => {
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
            Allocation of Delinquent Cases - Manual Reallocation
          </h1>
        </div>

        {/* Content Sections */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 space-y-6">
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
                Manual reallocation is a functionality within the Collections System
                that enables supervisors to reassign delinquent accounts to more
                suitable collectors. This process enhances the efficiency of
                collections by allocating cases to collectors who are better
                equipped to handle specific scenarios. The reallocation is done
                using the Manual Reallocation screen and is restricted to
                supervisors managing the corresponding users.
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
              <div id="actors-section" className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">Business User</h3>
                  <ul className="list-disc pl-5 text-gray-700 text-base">
                    <li>Collections Admin/Supervisor</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">System Roles</h3>
                  <ul className="list-disc pl-5 text-gray-700 text-base">
                    <li>Collections System</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">Stakeholders</h3>
                  <ul className="list-disc pl-5 text-gray-700 text-base">
                    <li>Collections Department</li>
                    <li>Branch Operations</li>
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
                <li>Collections Admin/Supervisor logs into the Collections System.</li>
                <li>Navigates to the Manual Reallocation screen.</li>
                <li>System displays delinquent cases based on defined queues.</li>
                <li>
                  Supervisor selects a delinquent case and updates necessary fields:
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <ul className="list-disc pl-5">
                      <li>Loan No. or Account No.</li>
                      <li>Customer Name</li>
                      <li>Customer ID</li>
                      <li>Card No.</li>
                      <li>Overdue Position</li>
                      <li>Financier</li>
                      <li>Financier Type</li>
                    </ul>
                    <ul className="list-disc pl-5">
                      <li>Rule Unit Code</li>
                      <li>Unit Level</li>
                      <li>Product Type</li>
                      <li>Product</li>
                      <li>Queue</li>
                      <li>Branch</li>
                    </ul>
                  </div>
                </li>
                <li>
                  Supervisor assigns the case to a new collector who reports to
                  them.
                </li>
                <li>
                  System confirms reallocation and updates the case ownership.
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
                <li>Delinquent cases are classified and auto-communicated.</li>
                <li>Initial allocation must be completed.</li>
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
                <li>Case is reallocated to a new collector.</li>
                <li>Updated in system for future collection follow-ups.</li>
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
                Login → Access Manual Reallocation Screen → Select Case → Update
                Info → Assign New Collector → Save
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
                <li>Bulk reallocation feature (future enhancement).</li>
                <li>Reassignment based on predefined performance metrics.</li>
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
                <li>Attempted reassignment outside supervisor’s hierarchy.</li>
                <li>Missing mandatory case data.</li>
                <li>Queue mismatch or stale data error.</li>
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
Login as Collections Admin/Supervisor
   |
   v
Access Manual Reallocation Screen
   |
   v
Select Delinquent Case
   |
   v
Update Case Info
   |
   v
Reassign to New Collector
   |
   v
Confirm Save
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
                <li>Option to track collector performance post-reallocation.</li>
                <li>
                  Integration with real-time dashboards for reassignment load
                  balancing.
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
                <li>UI: Manual Reallocation Screen</li>
                <li>DB Tables: Delinquent Cases, Collector Assignment Log</li>
                <li>APIs: Case Search, Collector Hierarchy Validator</li>
                <li>Services: Allocation Engine, Role-Based Access Control</li>
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
                <li>Supervisor reallocates a case successfully.</li>
                <li>System blocks unauthorized reassignment.</li>
                <li>Queue filtering works as expected.</li>
                <li>Reallocation audit is properly logged.</li>
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
                <li>Ensure real-time data refresh for delinquent queues.</li>
                <li>Access control must reflect reporting hierarchy accurately.</li>
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
                <li>Squad: Collections Workflow Team</li>
                <li>Contact: Lead Dev - delinquent_allocation@bankdomain.com</li>
                <li>JIRA: COLL-MANUAL-REALLOC-01</li>
                <li>Git Repo: /collections/manual-reallocation</li>
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default Manual_Reallocation_Use_Case;