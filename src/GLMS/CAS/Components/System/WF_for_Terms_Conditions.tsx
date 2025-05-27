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

interface WF_for_Terms_ConditionsProps {}

const WF_for_Terms_Conditions: React.FC<WF_for_Terms_ConditionsProps> = () => {
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
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
            Terms & Conditions in LOS
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
              <p
                id="description-section"
                className="text-gray-600 leading-relaxed text-base"
              >
                This use case outlines the process where the Bank Officer
                initiates, customizes, and finalizes the Terms & Conditions
                (T&C) for a proposed loan after completing customer and loan
                data entry. The Loan Origination System (LOS) assists by
                presenting default T&C based on product type and allows for
                addition, deletion, and modification before proceeding to
                recommendations.
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
              <div
                id="actors-section"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div>
                  <h3 className="font-medium text-gray-800 mb-2 text-base">
                    Primary Actor
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600 text-base">
                    <li>
                      Bank Officer - Reviews, customizes, and finalizes T&C
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2 text-base">
                    System Actors
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600 text-base">
                    <li>Loan Origination System (LOS)</li>
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
              <ol
                id="userActions-section"
                className="list-decimal pl-5 text-gray-600 text-base space-y-4"
              >
                <li>
                  <strong>User Action:</strong> Bank Officer initiates the T&C
                  entry for the proposed loan.
                  <br />
                  <strong>System Response:</strong> LOS displays a list of
                  default (generic/product-specific) T&C.
                </li>
                <li>
                  <strong>User Action:</strong> Officer reviews the listed T&C.
                  <br />
                  <strong>System Response:</strong> LOS provides interface to
                  edit/delete existing T&C.
                </li>
                <li>
                  <strong>User Action:</strong> Officer modifies or deletes
                  default T&C if needed.
                  <br />
                  <strong>System Response:</strong> Changes are reflected
                  immediately in the T&C section.
                </li>
                <li>
                  <strong>User Action:</strong> Officer adds any
                  additional/loan-specific T&C.
                  <br />
                  <strong>System Response:</strong> System updates Appraisal
                  Note/Process Note accordingly.
                </li>
                <li>
                  <strong>User Action:</strong> Officer finalizes and saves the
                  complete T&C.
                  <br />
                  <strong>System Response:</strong> LOS validates and stores the
                  finalized T&C.
                </li>
                <li>
                  <strong>User Action:</strong> Officer proceeds to the next
                  stage (recommendation submission).
                  <br />
                  <strong>System Response:</strong> System allows continuation
                  in the workflow.
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
                  <ul
                    id="precondition-section"
                    className="list-disc pl-5 text-gray-600 text-base"
                  >
                    <li>Customer ID and Loan Account are created and linked</li>
                    <li>
                      All required customer and financial data have been entered
                      in LOS
                    </li>
                    <li>Appraisal/Process note is generated</li>
                    <li>Risk Analysis and Loan Assessment completed</li>
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
                  <ul
                    id="postcondition-section"
                    className="list-disc pl-5 text-gray-600 text-base"
                  >
                    <li>Finalized Terms & Conditions are saved in LOS</li>
                    <li>Appraisal/Process Note is updated with T&C</li>
                    <li>Workflow proceeds to recommendation stage</li>
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
                Default T&C → Review/Edit → Finalize → Proceed to Recommendation
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
              <ul
                id="alternativeFlows-section"
                className="list-disc pl-5 text-gray-600 text-base"
              >
                <li>
                  Bank Officer skips deletion/modification if all T&C are valid
                </li>
                <li>Only additional T&C are added without touching defaults</li>
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
              <ul
                id="exceptionFlows-section"
                className="list-disc pl-5 text-gray-600 text-base"
              >
                <li>System fails to load default T&C → Error message shown</li>
                <li>
                  Bank Officer attempts to proceed without saving T&C →
                  Validation error
                </li>
                <li>
                  Invalid format or missing mandatory T&C → System blocks
                  progression
                </li>
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
              <p
                id="activityDiagram-section"
                className="text-gray-600 text-base"
              >
                Start → [Initiate T&C Entry in LOS] → [System Displays Default
                T&C] → [Officer Reviews and Edits/Deletes T&C] → [Officer Adds
                Additional T&C if Required] → [Finalize and Save T&C] → [Proceed
                to Recommendation] → End
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
              <ul
                id="parkingLot-section"
                className="list-disc pl-5 text-gray-600 text-base"
              >
                <li>Maintain version control of T&C history</li>
                <li>Enable digital acceptance of T&C by customer</li>
                <li>Auto-suggestion of T&C based on customer risk profile</li>
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
              <ul
                id="systemComponents-section"
                className="list-disc pl-5 text-gray-600 text-base"
              >
                <li>LOS Web Interface for T&C Management</li>
                <li>T&C Rules Engine (for product-specific clauses)</li>
                <li>Workflow Engine</li>
                <li>Appraisal Note Generator</li>
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
              <ul
                id="testScenarios-section"
                className="list-disc pl-5 text-gray-600 text-base"
              >
                <li>[ ] Bank Officer modifies and saves T&C successfully</li>
                <li>[ ] Additional T&C added and visible in Appraisal Note</li>
                <li>
                  [x] Bank Officer tries to proceed without saving - error shown
                </li>
                <li>
                  [x] T&C module fails to load defaults - error logged and
                  notified
                </li>
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
              <ul
                id="infra-section"
                className="list-disc pl-5 text-gray-600 text-base"
              >
                <li>Ensure product-type mappings for T&C are current</li>
                <li>T&C editor must be role-based (Bank Officer only)</li>
                <li>Ensure audit trail of T&C edits for compliance</li>
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
              <ul
                id="devTeam-section"
                className="list-disc pl-5 text-gray-600 text-base"
              >
                <li>
                  <strong>Squad:</strong> LOS Documentation & Workflow
                </li>
                <li>
                  <strong>Contact:</strong> Product Owner - LOS Core
                </li>
                <li>
                  <strong>Git Repo:</strong> /los-core/terms-conditions-module
                </li>
                <li>
                  <strong>Jira Ref:</strong> LOS-2112
                </li>
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default WF_for_Terms_Conditions;
