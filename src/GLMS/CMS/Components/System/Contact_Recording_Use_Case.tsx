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

interface Contact_Recording_Props {}

const Contact_Recording_Use_Case: React.FC<Contact_Recording_Props> = () => {
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
        {/* Heading Section */}
        <div className="mb-10">
          <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 border-b-2 border-blue-600 pb-4 text-center sm:text-left">
            Contact Recording
          </h1>
        </div>

        {/* Content Sections */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 space-y-6">
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
                The Contact Recording process is part of the Collections Workflow,
                enabling users—especially collectors and telecallers—to log
                follow-up actions and communications with delinquent customers.
                This is essential to ensure proper documentation and tracking of
                curing actions taken to recover dues. Once cases are allocated and
                prioritized, users initiate follow-up and record all customer
                interactions in the system via the Contact Recording menu.
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
              <ul
                id="actors-section"
                className="list-disc pl-5 text-gray-700 text-base"
              >
                <li>Collector/Telecaller (User)</li>
                <li>Supervisor</li>
                <li>Collections Management System</li>
              </ul>
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
                <li>
                  Supervisor allocates delinquent cases to collectors based on
                  amount overdue method.
                </li>
                <li>
                  User accesses the customer details screen and reviews all
                  associated data.
                </li>
                <li>
                  User initiates follow-up actions such as:
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <ul className="list-disc pl-5">
                      <li>Letter generation</li>
                      <li>SMS</li>
                      <li>Stat Card</li>
                    </ul>
                    <ul className="list-disc pl-5">
                      <li>Telecalling</li>
                      <li>Email</li>
                    </ul>
                  </div>
                </li>
                <li>
                  User records the follow-up details using the Contact Recording
                  option:
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <ul className="list-disc pl-5">
                      <li>Action date</li>
                      <li>Action start time</li>
                      <li>Action type</li>
                      <li>Contact mode</li>
                      <li>Person contacted</li>
                    </ul>
                    <ul className="list-disc pl-5">
                      <li>Place contacted</li>
                      <li>Next action date & time</li>
                      <li>Reminder mode</li>
                      <li>Contacted by</li>
                      <li>Remarks</li>
                    </ul>
                  </div>
                </li>
                <li>
                  System saves the details and updates the case follow-up status.
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
                <li>Delinquent cases must be saved in the database.</li>
                <li>Supervisor must have allocated and prioritized the cases.</li>
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
                  Follow-up action details are recorded and saved in the system.
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
                Login → Access Allocation → Review Customer Details → Take Curing
                Action → Record Action → Submit
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
                <li>Follow-up postponed and rescheduled.</li>
                <li>Follow-up assigned to a different collector.</li>
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
                <li>Attempt to record without case allocation.</li>
                <li>Missing or invalid entry fields during recording.</li>
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
Open Customer Details
   |
   v
Review Info
   |
   v
Take Curing Action
   |
   v
Record Details
   |
   v
Submit
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
                <li>Integration with predictive dialer or auto-SMS systems.</li>
                <li>Dashboard for follow-up efficiency analytics.</li>
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
                <li>UI: Contact Recording Form</li>
                <li>
                  DB Tables: Follow-up Actions, Customer Info, Allocation Details
                </li>
                <li>APIs: Notification Service, Reminder Engine</li>
                <li>Services: Case Tracking Service, Audit Trail Logger</li>
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
                <li>Record and save successful follow-up action.</li>
                <li>Validate reminder scheduling.</li>
                <li>Test invalid or missing data entry scenarios.</li>
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
                <li>High availability for contact recording services.</li>
                <li>Real-time sync for reminder alerts.</li>
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
                <li>Squad: Collections Operations Support</li>
                <li>Contact: collections_dev@bankdomain.com</li>
                <li>JIRA: COLL-CONTACT-01</li>
                <li>Git Repo: /collections/contact-recording</li>
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default Contact_Recording_Use_Case;