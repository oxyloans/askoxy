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

interface WF_for_Risk_AnalysisProps {}

const WF_for_Risk_Analysis: React.FC<WF_for_Risk_AnalysisProps> = () => {
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
            Risk Analysis in LOS
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
                Risk Analysis in the Loan Origination System (LOS) evaluates a
                customer’s creditworthiness by assessing financial, employment,
                personal, and security information. The purpose is to assign a
                risk rating score to determine loan eligibility and facilitate
                uniform loan appraisal processes.
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
                    Primary Actors
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600 text-base">
                    <li>Bank Officer (Customer-facing)</li>
                    <li>Loan Origination System (LOS) (System role)</li>
                    <li>Risk Engine Module (System role)</li>
                    <li>
                      External Verification Agencies (Legal, Technical,
                      Financial, Employment checks)
                    </li>
                    <li>
                      Core Banking System (for data integration and validation)
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2 text-base">
                    Software Stakeholders
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600 text-base">
                    <li>API Developers</li>
                    <li>QA Team</li>
                    <li>CloudOps</li>
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
                  <strong>User Action:</strong> Bank Officer selects a loan
                  application with linked Customer ID.
                  <br />
                  <strong>System Response:</strong> LOS fetches all customer and
                  loan details.
                </li>
                <li>
                  <strong>User Action:</strong> Officer requests
                  Legal/Technical/Employment/Financial verification.
                  <br />
                  <strong>System Response:</strong> System routes requests to
                  respective departments or integrated APIs.
                </li>
                <li>
                  <strong>User Action:</strong> Officer enters/updates data from
                  received reports.
                  <br />
                  <strong>System Response:</strong> LOS stores and confirms all
                  relevant verification inputs.
                </li>
                <li>
                  <strong>User Action:</strong> Officer initiates risk analysis.
                  <br />
                  <strong>System Response:</strong> Risk Engine calculates risk
                  rating based on parameters and weightages.
                </li>
                <li>
                  <strong>User Action:</strong> Officer reviews calculated risk
                  score.
                  <br />
                  <strong>System Response:</strong> System displays recommended
                  risk category and allows manual comments.
                </li>
                <li>
                  <strong>User Action:</strong> Officer submits final risk
                  analysis.
                  <br />
                  <strong>System Response:</strong> LOS updates the loan record
                  with finalized risk score.
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
                    <li>Customer ID created and linked to loan account</li>
                    <li>
                      Complete capture of asset, liabilities, proposed loan
                      limits, and details of co-applicants/guarantors
                    </li>
                    <li>Appraisal or Process Note generated</li>
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
                    <li>Risk rating score computed and categorized</li>
                    <li>Risk data stored in LOS</li>
                    <li>Loan progresses to Assessment stage</li>
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
                Login → Select Loan App → Submit for Verifications → Auto Score
                → Submit Risk → Proceed to Loan Assessment
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
                <li>Assisted Mode via branch login</li>
                <li>API-driven automation by backend risk rules engine</li>
                <li>Self-service dashboards for status tracking</li>
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
                <li>Missing reports from Legal/Technical/Financial agency</li>
                <li>Invalid or incomplete customer data</li>
                <li>Risk engine timeout or API failure</li>
                <li>Manual override required due to risk score anomalies</li>
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
                User Activity Diagram (Simplified Flow)
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
                Start → [Select Loan Application] → [Fetch Customer Details] →
                [Trigger Verifications] → [Receive Reports] → [Run Risk Engine]
                → [View & Submit Risk] → End
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
              <ul
                id="parkingLot-section"
                className="list-disc pl-5 text-gray-600 text-base"
              >
                <li>
                  Integration with Credit Bureau APIs for auto pull of credit
                  history
                </li>
                <li>ML-based predictive scoring engine</li>
                <li>Risk score visualization graphs</li>
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
                <li>
                  <strong>UI Screens:</strong> Risk Analysis, Loan Summary,
                  Report Uploads
                </li>
                <li>
                  <strong>APIs:</strong> Verification APIs, Risk Engine API
                </li>
                <li>
                  <strong>DB Tables:</strong> Customer, Loan Account, Risk Score
                </li>
                <li>
                  <strong>Message Queues:</strong> Report Triggers
                </li>
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
                <li>
                  <strong>Functional:</strong> Risk score calculation, data
                  fetch
                </li>
                <li>
                  <strong>Edge:</strong> Missing/incorrect report values
                </li>
                <li>
                  <strong>Negative:</strong> Fail with missing customer ID
                </li>
                <li>
                  <strong>Integration:</strong> APIs for report fetching
                </li>
                <li>
                  <strong>Performance:</strong> Handle concurrent requests for
                  1000+ officers
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
                <li>Cloud-based deployment of LOS modules</li>
                <li>Feature flags for Risk Scoring toggle</li>
                <li>Daily batch run for score re-evaluation</li>
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
                  <strong>Squad:</strong> LOS Risk Analysis Team
                </li>
                <li>
                  <strong>Contact:</strong> Rahul Sharma (PM), Archana Desai
                  (Lead Dev)
                </li>
                <li>
                  <strong>Jira:</strong> RSK-1083
                </li>
                <li>
                  <strong>Repo:</strong> gitlab.com/bankLOS/risk-analysis
                </li>
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default WF_for_Risk_Analysis;
