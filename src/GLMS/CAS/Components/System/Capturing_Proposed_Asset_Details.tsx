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

interface WF_for_Capturing_Proposed_Asset_DetailsProps {}

const WF_for_Capturing_Proposed_Asset_Details: React.FC<
  WF_for_Capturing_Proposed_Asset_DetailsProps
> = () => {
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
            Capturing Proposed Asset Details in LOS
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
                This use case describes how a Bank Officer captures Proposed
                Asset details in the Loan Origination System (LOS) based on the
                applicant’s loan application form. These asset details are
                essential for further appraisal, loan assessment, and sanction
                processes.
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
                    <li>Bank Officer</li>
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
                  <strong>User Action:</strong> Bank Officer initiates asset
                  entry after linking Customer ID to Loan Product.
                  <br />
                  <strong>System Response:</strong> LOS opens the Proposed Asset
                  Details form.
                </li>
                <li>
                  <strong>User Action:</strong> Officer reviews loan application
                  for asset-related data.
                  <br />
                  <strong>System Response:</strong> N/A (Manual review step).
                </li>
                <li>
                  <strong>User Action:</strong> Officer enters loan type and
                  asset type.
                  <br />
                  <strong>System Response:</strong> LOS validates allowed loan
                  and asset types.
                </li>
                <li>
                  <strong>User Action:</strong> Officer inputs purpose of loan
                  and asset cost.
                  <br />
                  <strong>System Response:</strong> System captures and stores
                  entries.
                </li>
                <li>
                  <strong>User Action:</strong> Officer enters total purchase
                  price, incidental cost, and other cost (if any).
                  <br />
                  <strong>System Response:</strong> System calculates total cost
                  if configured.
                </li>
                <li>
                  <strong>User Action:</strong> Officer provides market value
                  and loan outstanding (for refinance).
                  <br />
                  <strong>System Response:</strong> System stores financial
                  attributes.
                </li>
                <li>
                  <strong>User Action:</strong> For home loans: Officer fills in
                  address, land area, built-up area, stage of construction.
                  <br />
                  <strong>System Response:</strong> Conditional fields displayed
                  by LOS based on loan type.
                </li>
                <li>
                  <strong>User Action:</strong> Officer completes and saves the
                  record.
                  <br />
                  <strong>System Response:</strong> LOS validates completeness
                  and saves asset details.
                </li>
                <li>
                  <strong>User Action:</strong> Officer proceeds to check
                  proposed loan limit.
                  <br />
                  <strong>System Response:</strong> System redirects to proposed
                  limit assessment section.
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
                    <li>Customer ID has been created</li>
                    <li>Customer ID is linked to a Loan Product</li>
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
                    <li>
                      Proposed Asset details are successfully saved in LOS
                    </li>
                    <li>
                      Officer can proceed to assess the proposed loan limit
                    </li>
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
                Link Customer ID → Enter Asset Details → Save → Proceed to Loan
                Assessment
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
                  <strong>Refinance case:</strong> System requires "Loan
                  Outstanding" field.
                </li>
                <li>
                  <strong>Non-home loan:</strong> Home loan-specific fields are
                  hidden or disabled.
                </li>
                <li>
                  <strong>Missing required fields:</strong> System prompts error
                  messages before saving.
                </li>
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
                <li>
                  <strong>Asset details incomplete:</strong> Validation error
                  shown; user cannot proceed.
                </li>
                <li>
                  <strong>Incorrect cost/market value entry:</strong> Error
                  message with field highlight.
                </li>
                <li>
                  <strong>Attempt to save without loan type:</strong> Mandatory
                  field error prompt.
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
                Start → [Link Customer ID to Loan Product] → [Initiate Asset
                Details Entry] → [Enter General Asset Info] → [Enter Cost and
                Market Info] → [Enter Home Loan Info (if applicable)] → [Save] →
                [Proceed to Proposed Limit Check] → End
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
                <li>
                  Auto-fetch property valuation via integration with external
                  systems
                </li>
                <li>GIS integration for property location validation</li>
                <li>Document upload for property proofs</li>
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
                <li>LOS Front-End (Web Form UI for Asset Details)</li>
                <li>Asset Master (Back-End Storage & Validation Engine)</li>
                <li>
                  Product Rules Engine (For conditional fields and validation)
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
                  All fields filled correctly: Asset details saved successfully
                </li>
                <li>
                  Missing mandatory field: Error shown; form not submitted
                </li>
                <li>
                  Refinance selected: Loan Outstanding field is visible and
                  required
                </li>
                <li>
                  Home loan selected: Address, area, stage fields are shown
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
                <li>Ensure responsive form layout for all modules</li>
                <li>Mandatory field logic must be aligned with product type</li>
                <li>Field-level audit trail enabled for compliance</li>
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
                  <strong>Squad:</strong> LOS Asset Management
                </li>
                <li>
                  <strong>Product Owner:</strong> Mani - Dev (lead)
                </li>
                <li>
                  <strong>Git Repo:</strong> /los-core/asset-capture
                </li>
                <li>
                  <strong>Jira Reference:</strong> LOS-2153
                </li>
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default WF_for_Capturing_Proposed_Asset_Details;
